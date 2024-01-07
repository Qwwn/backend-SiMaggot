/* eslint-disable camelcase */
const db = require('../configurations/dataBaseConfig')
const gc = require('../configurations/storageConfig')
const bucket = gc.bucket('si-maggot-product')
const NotFoundError = require('../exceptions/NotFoundError.js')
const ClientError = require('../exceptions/ClientError.js')
const SellerServices = require('./sellerServices.js')
const sellerServices = new SellerServices()
class ProductServices {
  constructor () {
    this._sellerServices = sellerServices
    this._db = db
  }

  async getProducts () {
    try {
      const querySnapshot = await db.collectionGroup('product').get()
  
      const productsData = []
      querySnapshot.forEach((doc) => {
        const productData = doc.data()
        const { caseSearch, ...restproductData } = productData
        productsData.push(restproductData)
      })
      
      if (productsData.length === 0) {
        throw new NotFoundError('products not found')
      }

      return productsData
    } catch (error) {
      throw error
    }
  }

  async getProductById(idProduct) {
    try {
      const querySnapshot = await db.collectionGroup('product').where('id', '==', idProduct).get()
  
      let productDatas = null  
      querySnapshot.forEach((doc) => {
        const productData = doc.data()
        const { caseSearch, ...restProductData } = productData
        productDatas = restProductData
      })

      if (!productDatas) {
        throw new NotFoundError('Product not found')
      }
  
      return productDatas
    } catch (error) {
      throw error
    }
  }

  async getSellerProducts (sellerId) {
    const productsData = []
    const datas = await db.collection('products').doc(sellerId).collection('product').get()
    datas.forEach((data) => {
      const productData = data.data()
      productsData.push(productData)
    })
  
    if (productsData.length === 0) {
      throw new NotFoundError('products not found')
    }
  
    return productsData
  }
  
  async getSellerProductById (productId, sellerId) {
    try {
      let productData = null
      const datas = await db.collection('products').doc(sellerId).collection('product').where('id', '==', productId).get()
      datas.forEach((data) => { 
        productData = data.data()
      })
      
      if (!productData) {
        throw new NotFoundError('product not found')
      }
  
      return productData
    } catch (error) {
      throw error
    }
  }

  async getSellerProductByName(productName, sellerId) {
    try {
      const productQuery = await db.collection('products').doc(sellerId).collection('product').where('caseSearch', 'array-contains', productName.toLowerCase()).get()
      const productData = []
      productQuery.forEach((doc) => {
        const product = doc.data()
        const { caseSearch, ...productWithoutCaseSearch } = product
        productData.push(productWithoutCaseSearch)
      })

      if (productData.length === 0) {
        const productDataByName = await this.getProductsByName(productName)
        return productDataByName
      }
      
      return productData
    } catch (error) {
      throw error
    }
  }

  async getProductsByName(productName) {
    try {
      const querySnapshot = await db.collection('products').get()
      const promises = []
  
      querySnapshot.forEach((doc) => {
        const sellerId = doc.id
  
        if (sellerId) {
          const productQuery = db.collection('products').doc(sellerId).collection('product').where('caseSearch', 'array-contains', productName.toLowerCase()).get()
          const sellerDataPromise = this._sellerServices.getSellerById(sellerId)
  
          promises.push({ productQuery, sellerDataPromise })
        }
      })

      const results = await Promise.all(promises)
  
      const productData = []
      for (const { productQuery, sellerDataPromise } of results) {
        const [productSnapshot, sellerData] = await Promise.all([productQuery, sellerDataPromise])
  
        productSnapshot.forEach((snap) => {
          const product = snap.data()
          const { caseSearch, ...productWithoutCaseSearch } = product
          productData.push({ ...productWithoutCaseSearch, seller: sellerData })
        })

        if (productData.length === 0) {
          throw new NotFoundError('Product not found')
        }
      }
  
      return productData
    } catch (error) {
      console.error('Error getting Products:', error)
      throw error
    }
  }
  
  async addProduct (data) {
    try {
      const { cover, ...newData } = data
      const { id, productName, sellerId } = data
      const searchParams = await this.setSeacrhParams(productName)
      const isProductExist = await this.verifyProductsExistByName(productName, sellerId)
      if (isProductExist) {
        throw new ClientError('product already exist')
      }

      if (cover !== undefined) {
        const filename = `${id}_${data.cover.originalname}`
        const file = await this.uploadProductImage(filename, data.cover.buffer)

        if (file) {
          const imageUrl = `${process.env.GS_URL}/${file}`
          newData.cover = imageUrl
        } else {
          return null
        }
      }
      const doc = db.collection('products').doc(sellerId).collection('product').doc(productName)
      await doc.set({ ...newData, caseSearch: searchParams })
      return id
    } catch (error) {
      throw error
    }
  }

  async updateProduct (data, productId, sellerId, productName) {
    try {
      const isProductExist = await this.verifyProductExistById(productId, sellerId)
      if (!isProductExist) {
        throw new NotFoundError('product not found')
      }

      if (data.cover !== undefined) {
        const query = db.collection('products').doc(sellerId).collection('product').where('id', '==', productId)
        const snapshot = await query.get()
        await this.deleteProductImage(snapshot)

        const { cover: { originalname, buffer } } = data
        const filename = `${productId}_${originalname}`
        const file = await this.uploadProductImage(filename, buffer)
        const imageUrl = `${process.env.GS_URL}/${file}`
        data.cover = imageUrl
      }
      const doc = db.collection('products').doc(sellerId).collection('product').doc(productName)
      await doc.update(data)
    } catch (error) {
      return error
    }
  }

  async deleteSellerProductById (productId, sellerId) {
    try {
      const isProductExist = await this.verifyProductExistById(productId, sellerId)
      if (!isProductExist) {
        throw new NotFoundError('product not found')
      }
      const query = db.collection('products').doc(sellerId).collection('product').where('id', '==', productId)
      const snapshot = await query.get()
      
      if (!snapshot.empty) {
        await snapshot.forEach((doc) => {
          if (doc.cover !== undefined) this.deleteProductImage(snapshot)
          doc.ref.delete()
        })
      }
    } catch (error) {
      throw error
    }
  }

  async uploadProductImage (filename, buffer) {
    try {
      const file = bucket.file(filename)
      await file.save(buffer)
      return file.name
    } catch (error) {
      return error
    }
  }

  async deleteProductImage (data) {
    try {
      const filename = await Promise.all(data.docs.map(async (doc) => {
        const productData = doc.data()
        const coverFile = productData.cover ? productData.cover.split('/').pop() : undefined
        return coverFile
      }))

      if (filename[0] !== undefined) {
        const file = bucket.file(filename)
    
        const exists = await file.exists()
    
        if (exists[0]) {
          await file.delete()
        } else {
          throw new NotFoundError('Image File Not Found')
        }
      }
    } catch (error) {
      throw error
    }
  }

  async createGSDirectory(directoryPath) {
    try {
      await bucket.file(directoryPath).create({ ifNotExist: true })
    } catch (error) {
      throw error
    }
  }

  async verifyProductsExistByName(productName, sellerId) {
    const productData = await db.collection('products').doc(sellerId).collection('product').where('productName', '==', productName).get()
    if (!productData.empty) {
      return true
    } else {
      return false
    }
  }

  async verifyProductExistById(productId, sellerId) {
    const productData = await db.collection('products').doc(sellerId).collection('product').where('id', '==', productId).get()
    if (!productData.empty) {
      return true
    } else {
      return false
    }
  }

  async setSeacrhParams(productName) {
    const caseSearchList = []
    let temp = ''
    for (let i = 0; i < productName.length; i++) {
      temp = temp + productName[i]
      caseSearchList.push(temp.toLowerCase())
    }
    return caseSearchList
  }
}
module.exports = ProductServices
