const express = require('express')
const router = express.Router()
const multer = require('multer')
const validator = require('../../validator/seller')
const SellerHandler = require('./handler')
const upload = multer()
const AuthorizationServices = require('../../services/authorizationServices')
const SellerServices = require('../../services/sellerServices')
const sellerServices = new SellerServices()
const handler = new SellerHandler(validator, sellerServices)

router.post('/', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: credentialId } = decodedToken
    if (req.file) req.body.cover = req.file
    const sellerId = await handler.postSellerHandler(credentialId, req.body)

    res.status(201).json({
      status: 'Success',
      message: 'Seller Registered',
      data: {
        sellerId
      }
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken
    const data = await handler.getSellerByOwnerIdHandler(ownerId)
    res.status(200).json(
      { 
        status: 'Success',
        message: 'Success get seller',
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

router.get('/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params
    const data = await handler.getSellerByIdHandler(sellerId)
    res.status(200).json(
      { 
        status: 'Success',
        message: 'Success get seller',
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

router.put('/:sellerId', upload.single('cover'), async (req, res) => {
  try {
    const { sellerId } = req.params
    const token = req.headers.authorization
    await AuthorizationServices(token)
    if (req.file) req.body.cover = req.file

    await handler.putSellerByIdHandler(sellerId, req.body)
    res.status(200).json(
      { 
        status: 'Success',
        message: 'Success update seller'
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

// route seller product
router.get('/:sellerId/products', async (req, res) => {
  try {
    const data = await handler.getSellerProductsHandler(req.params.sellerId)
    res.status(200)
    res.send(
      {
        status: 'Success',
        message: 'Success get products',
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

router.get('/:sellerId/products/:id', async (req, res) => {
  try {
    const { id, sellerId } = req.params
    const data = await handler.getSellerProductByIdHandler(id, sellerId)
    res.status(200) 
    res.send(
      {
        status: 'Success',
        message: 'Success get product',
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

router.get('/transaction/list', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken
    const transactionData = await handler.getSellerTransactionHandler(ownerId)
    res.status(200).json(
      { 
        status: 'Success',
        message: 'Success get seller',
        data: transactionData
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})

router.post('/products', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken
    if (req.file) req.body.cover = req.file

    const id = await handler.addSellerProductHandler(req.body, ownerId)
    
    res.status(201)
    res.send({
      status: 'Success',
      message: 'Product added',
      data: {
        id
      }
    })
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})
router.put('/products/:id', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken

    const { id: productId } = req.params
    
    if (req.file !== undefined) {
      req.body.cover = req.file
    }    
    await handler.updateSellerProductHandler(req.body, ownerId, productId)

    res.status(200)
    res.send({
      status: 'Success',
      message: 'Product Successfully Updated'
    })
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken

    const { id: productId } = req.params
    await handler.deleteSellerProductHandler(ownerId, productId)
    res.status(200)
    res.send({
      status: 'Success',
      message: 'Product Successfully Deleted'
    })
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})
module.exports = router
