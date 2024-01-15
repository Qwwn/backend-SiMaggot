const Joi = require('joi')

const allowedCategories = ['Maggot', 'Alat', 'Bundle']

const postProductPayloadSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string(),
  category: Joi.string().valid(...allowedCategories).required(),
  rating: Joi.number(),
  sold: Joi.number(),
  isFavorite: Joi.boolean(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  stock: Joi.number().required()
})
const getQueryProductPayloadSchema = Joi.object({
  productName: Joi.string().required()
})

const putProductPayloadSchema = Joi.object({
  productName: Joi.string(),
  price: Joi.number(),
  description: Joi.string(),
  category: Joi.string().valid(...allowedCategories),
  rating: Joi.number(),
  sold: Joi.number(),
  isFavorite: Joi.boolean(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  stock: Joi.number()
})

module.exports = {
  postProductPayloadSchema,
  getQueryProductPayloadSchema,
  putProductPayloadSchema
}
