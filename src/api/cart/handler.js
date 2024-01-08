const ProductServices = require('../../services/productServices')
const SellerServices = require('../../services/sellerServices')
const productServices = new ProductServices()
const sellerServices = new SellerServices()
class CartHandler {
  constructor(services, validator) {
    this._service = services
    this._validator = validator
    this._productServices = productServices
    this._sellerServices = sellerServices
  }

  async getCartHandler(userId) {
    try {
      return await this._service.getCart(userId)
    } catch (error) {
      throw error
    }
  }

  async getCartByIdHandler(cartId) {
    try {
      return await this._service.getCart(cartId)
    } catch (error) {
      throw error
    }
  }

  async postProductToCartHandler(userId, payload, productId) {
    try {
      this._validator.validatePostCartPayload(payload)
      const productData = await this._productServices.getProductById(productId)
      const { cover, price, productName, sellerId } = productData
      const sellerData = await this._sellerServices.getSellerById(sellerId)
      
      const total = price * payload.quantity
      if (cover) {
        payload.cover = cover
      }
      payload = {
        ...payload,
        productId,
        price,
        seller: sellerData,
        productName,
        subtotal: total
      }
      return await this._service.addProductToCart(userId, payload)
    } catch (error) {
      throw error
    }
  }

  async updateCartHandler(userId, payload, productId) {
    try {
      this._validator.validatePutCartPayload(payload)

      return await this._service.updateProductInCart(userId, payload, productId)
    } catch (error) {
      throw error
    }
  }

  async deleteProductCartHandler(userId, productId) {
    try {
      return await this._service.deleteProductCart(userId, productId)
    } catch (error) {
      throw error
    }
  }
}

module.exports = CartHandler
