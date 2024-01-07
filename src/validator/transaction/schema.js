const Joi = require('joi')

const postTransactionPayloadSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      id: Joi.string().required(), 
      productName: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required()
    })
  ).required()
})

module.exports = {
  postTransactionPayloadSchema
}
