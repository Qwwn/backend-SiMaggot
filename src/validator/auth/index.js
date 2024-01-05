const InvariantError = require('../../exceptions/InvariantError')
const {
  addUserSchema,
  loginSchema
} = require('./schema')

const AuthValidator = {
  validatePostUserPayload: (payload) => {
    const dataForValidate = payload
    dataForValidate.cover = payload.cover.mimetype
    const validationResult = addUserSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateLoginPayload: (payload) => {
    const validationResult = loginSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = AuthValidator
