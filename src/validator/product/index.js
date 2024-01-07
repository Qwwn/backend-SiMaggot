const InvariantError = require('../../exceptions/InvariantError')
const {
  postProductPayloadSchema,
  getQueryProductPayloadSchema,
  putProductPayloadSchema
} = require('./schema')

const ProductsValidator = {
  validatePostProductPayload: (payload) => {
    const dataForValidate = payload
    if (dataForValidate.cover !== undefined) {
      dataForValidate.cover = payload.cover.mimetype
    }
    const validationResult = postProductPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePutProductPayload: (payload) => {
    const dataForValidate = payload
    if (dataForValidate.cover !== undefined) {
      dataForValidate.cover = payload.cover.mimetype
    }
    const validationResult = putProductPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateQueryProductPayload: (payload) => {
    const validationResult = getQueryProductPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = ProductsValidator
