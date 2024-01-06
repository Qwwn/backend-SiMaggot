const express = require('express')
const app = express()
/* eslint-disable no-unused-vars */
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRoutes = require('./routes/authRoute.js')
const authenticate = require('./middleware/authenticate.js')
const users = require('./api/user')

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.use(cors())
app.use(bodyParser.json())

app.use('/auth', authRoutes)
app.use('/user', users)

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user })
})
