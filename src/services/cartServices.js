/* eslint-disable no-useless-return */
/* eslint-disable array-callback-return */
const db = require('../configurations/dataBaseConfig')
const NotFoundError = require('../exceptions/NotFoundError')

class CartServices {
  constructor() {
    this._db = db
  }

  async getCart(userId) {
    try {
      const querySnapshot = await db.collection('carts').where('userId', '==', userId).get()

      let cartsData = null
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        cartsData = cartData
      })

      if (!cartsData) {
        throw new NotFoundError('Cart not found')
      }
      
      return cartsData
    } catch (error) {
      throw error
    }
  }

  async addCart (data) {
    try {
      const doc = db.collection('carts').doc(data.id)
      await doc.set(data)
    } catch (error) {
      throw error
    }
  }

  async addProductToCart(userId, payload) {
    try {
      const querySnapshot = await db.collection('carts').where('userId', '==', userId).get()

      if (querySnapshot.empty) {
        throw new NotFoundError('Cart not found')
      }

      let productsData = null
      querySnapshot.forEach((data) => { 
        const { products } = data.data()
        productsData = products
      })

      productsData.push(payload)
      const docRef = querySnapshot.docs[0].ref

      const total = productsData.reduce((acc, curr) => {
        return acc + curr.subtotal
      }, 0)
      await docRef.update({
        total,
        products: productsData
      })
    } catch (error) {
      throw error
    }
  }
  
  async updateProductInCart(userId, payload, productId) {
    try {
      const querySnapshot = await db.collection('carts').where('userId', '==', userId).get()

      if (querySnapshot.empty) {
        throw new NotFoundError('Cart not found')
      }

      let productsData = null
      querySnapshot.forEach((data) => { 
        const { products } = data.data()
        productsData = products
      })

      const existingProductIndex = productsData.findIndex((product) => product.productId === productId)

      if (existingProductIndex !== -1) {
        productsData[existingProductIndex].quantity = (payload.quantity !== undefined ? payload.quantity : productsData[existingProductIndex].quantity) 
        productsData[existingProductIndex].subtotal = productsData[existingProductIndex].quantity * productsData[existingProductIndex].price
      } else {
        throw new NotFoundError('Product not found In Cart')
      }

      if (productsData[existingProductIndex].quantity === 0) {
        productsData.splice(existingProductIndex, 1) 
      }

      const total = productsData.reduce((acc, curr) => {
        return acc + curr.subtotal
      }, 0)

      const docRef = querySnapshot.docs[0].ref

      await docRef.update({
        total,
        products: productsData
      }) 
      return { message: 'Cart quantity updated successfully' }
    } catch (error) {
      throw error
    }
  }

  async deleteProductCart(userId, productId) {
    try {
      const querySnapshot = await db.collection('carts').where('userId', '==', userId).get()

      if (querySnapshot.empty) {
        throw new NotFoundError('Cart not found')
      }

      let productsData = null
      querySnapshot.forEach((data) => { 
        const { products } = data.data()
        productsData = products
      })
      const existingProductIndex = productsData.findIndex((product) => product.productId === productId)

      if (existingProductIndex !== -1) {
        productsData.splice(existingProductIndex, 1)
      } else {
        throw new NotFoundError('Product not found In Cart')
      }

      const docRef = querySnapshot.docs[0].ref

      await docRef.update({
        products: productsData
      }) 
      return productId
    } catch (error) {
      throw error
    }
  }
}

module.exports = CartServices
