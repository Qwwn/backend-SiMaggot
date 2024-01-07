class SearchHandler {
  constructor (services, validator) {
    this._service = services
    this._validator = validator
  }
  
  async getSellerProductByNameHandler (productName, sellerId) {
    const data = await this._service.getSellerProductByName(productName, sellerId)
    return data
  }

  async getProductByNameHandler(productName) {
    const data = await this._service.getProductsByName(productName)
    return data
  }
}
module.exports = SearchHandler
