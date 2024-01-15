const express = require('express')
const app = express()
/* eslint-disable no-unused-vars */
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRoutes = require('./routes/authRoute.js')
const authenticate = require('./middleware/authenticate.js')
const users = require('./api/user')
const search = require('./api/search')
const products = require('./api/product')
const seller = require('./api/seller')
const transaction = require('./api/transaction')
const cart = require('./api/cart')

const PORT = process.env.PORT || 8080
// eslint-disable-next-line prefer-const
let server = app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})

const corsOptions = {
  origin: '*', 
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

app.use('/auth', authRoutes)
app.use('/user', users)
app.use('/seller', seller)
app.use('/search', search)
app.use('/product', products)
app.use('/cart', cart)
app.use('/transaction', transaction)
