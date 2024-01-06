const Joi = require('joi')

const addUserSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  contact: Joi.string().required(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp')
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

module.exports = {
  addUserSchema,
  loginSchema
}
