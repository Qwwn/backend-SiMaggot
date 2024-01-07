const express = require('express')
const router = express.Router()
const ProductHandler = require('./handler')
const validator = require('../../validator/product')
const ProductServices = require('../../services/productServices')
const productServices = new ProductServices()
const handler = new ProductHandler(productServices, validator)

router.get('/', async (req, res) => {
  try {
    const data = await handler.getProductsHandler()
    res.status(200).json(
      {
        status: 'Success',
        message: 'Success get Products',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await handler.getProductByIdHandler(id)
    res.status(200).json(
      {
        status: 'success',
        message: 'Success get flower',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

module.exports = router
