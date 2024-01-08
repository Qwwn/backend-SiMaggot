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

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.use(cors())
app.use(bodyParser.json())

app.use('/auth', authRoutes)
app.use('/user', users)
app.use('/seller', seller)
app.use('/search', search)
app.use('/product', products)
app.use('/cart', cart)
app.use('/transaction', transaction)

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user })
})
