const Joi = require('joi')

const postSellerPayloadSchema = Joi.object({
  name: Joi.string().required(),  
  description: Joi.string().required(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  address: Joi.string().required()
})

const putSellerPayloadSchema = Joi.object({
  description: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  address: Joi.string()
})
module.exports = {
  postSellerPayloadSchema,
  putSellerPayloadSchema
}
