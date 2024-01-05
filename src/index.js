/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes.js')

const port = parseInt(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.use(cors())
app.use(bodyParser.json())

app.use('/auth', authRoutes)


app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user })
})