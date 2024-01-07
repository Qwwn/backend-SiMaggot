class ProductHandler {
  constructor (services, validator) {
    this._service = services
    this._validator = validator
  }

  async getProductsHandler () {
    const data = await this._service.getProducts()
    return data
  }

  async getProductByIdHandler (idProduct) {
    const data = await this._service.getProductById(idProduct)
    return data
  }
}
module.exports = ProductHandler
