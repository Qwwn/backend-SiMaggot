const express = require('express')
const router = express.Router()
const SearchHandler = require('./handler')
const validator = require('../../validator/product')
const ProductServices = require('../../services/productServices')
const productServices = new ProductServices()
const handler = new SearchHandler(productServices, validator)

router.get('/seller/:sellerId/products', async (req, res) => {
  try {
    const { sellerId } = req.params
    const { productName } = req.query
    const data = await handler.getSellerProductByNameHandler(productName, sellerId)
    res.status(200)
    res.send(
      {
        status: 'Success',
        message: 'Success get Products',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})

router.get('/products', async (req, res) => {
  try {
    const { productName } = req.query
    const data = await handler.getProductByNameHandler(productName)
    res.status(200)
    res.send(
      {
        status: 'Success',
        message: 'Success get Products',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})

module.exports = router
