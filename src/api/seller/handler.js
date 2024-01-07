const { nanoid } = require('nanoid')
const ProductService = require('../../services/productServices')
const productValidator = require('../../validator/product')
class SellerHandler {
  constructor (validator, services) {
    // this._service = service
    this._validator = validator
    this._productValidator = productValidator
    this._sellerServices = services
    this._productService = new ProductService()
  }

  async postSellerHandler (credentialId, payload) {
    const image = payload.cover !== undefined ? payload.cover : undefined
    await this._validator.validatePostSellerPayload(payload)
    await this._sellerServices.verifyUserIsSeller(credentialId)
    const sellerId = `seller-${nanoid(16)}`

    if (image !== undefined) payload.cover = image

    let { ...newObject } = payload
    newObject = {
      ...newObject,
      sellerId,
      ownerId: credentialId
    }
    const id = await this._sellerServices.addSeller(newObject)
    return id
  }

  async putSellerByIdHandler(sellerId, payload) {
    const image = payload.cover !== undefined ? payload.cover : undefined
    await this._validator.validatePutSellerPayload(payload)
    
    if (image !== undefined) payload.cover = image

    const { ...newObject } = payload

    await this._sellerServices.putSellerById(sellerId, newObject)
  }

  async getSellerByIdHandler (sellerId) {
    const sellerData = await this._sellerServices.getSellerById(sellerId)
    return sellerData
  }

  async getSellerByOwnerIdHandler (ownerId) {
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    return sellerData
  }

  async getSellerProductsHandler (sellerId) {
    const productsData = await this._productService.getSellerProducts(sellerId)
    return productsData
  }
  
  async getSellerProductByIdHandler (productId, sellerId) {
    const productsData = await this._productService.getSellerProductById(productId, sellerId)
    return productsData
  }

  async getSellerTransactionHandler (ownerId) {
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData
    const transactionData = await this._sellerServices.getTransactionsSeller(sellerId)
    return transactionData
  }

  async addSellerProductHandler (payload, ownerId) {
    const { price, stock, cover } = payload
    await this._productValidator.validatePostProductPayload(payload)
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData
    const priceNum = Number(price)
    const stockNum = Number(stock)
    const id = `product-${nanoid(16)}_${sellerId}`
    payload = {
      ...payload,
      id,
      sellerId,
      price: priceNum,
      stock: stockNum,
      cover
    }
    await this._productService.addProduct(payload)
    return payload.id
  }

  async updateSellerProductHandler (payload, ownerId, productid) {
    const cover = payload.cover !== undefined ? payload.cover : undefined
    await this._productValidator.validatePutProductPayload(payload)

    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData

    const productData = await this._productService.getSellerProductById(productid, sellerId)
    const productName = productData.productName

    if (payload.price !== undefined) payload.price = Number(payload.price)
    if (payload.stock !== undefined) payload.stock = Number(payload.stock)

    if (cover !== undefined) payload.cover = cover
    await this._productService.updateProduct(payload, productid, sellerId, productName)
  }

  async deleteSellerProductHandler(ownerId, productId) {
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData
    
    const result = await this._productService.deleteSellerProductById(productId, sellerId)
    return result
  }
}
module.exports = SellerHandler
