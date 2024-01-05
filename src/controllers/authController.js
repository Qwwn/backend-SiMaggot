const admin = require('../config/firebaseAdminConfig')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth')
const app = require('../config/firebaseConfig')
const AuthenticationServices = require('../services/authenticationServices')
const axios = require('axios')
const bcrypt = require('bcrypt')
const params = new URLSearchParams()
const AuthorizationError = require('../exceptions/AuthorizationError')
const auth = getAuth(app)

exports.signup = async (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    }
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      const signUpResponse = await createUserWithEmailAndPassword(auth, user.email, user.password)
      const responses = {
        userId: signUpResponse.user.uid,
        email: signUpResponse.user.email,
        password: hashedPassword
      }
      res.status(200).json({ status: 'Success', message: 'Successful SignUp', data: responses })
    } catch (error) {
      res.status(500).json({ status: 'Failed', message: 'Failed To SignUp', error: error.code })
    }
  }

exports.login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    const signInResponse = await signInWithEmailAndPassword(auth, user.email, user.password)
    const credential = await signInResponse.user.getIdToken(true)
    const refreshToken = signInResponse.user.refreshToken
    res.status(200).json({ status: 'Success', message: 'Successful SignIn', credential, refreshToken })
  } catch (error) {
    res.status(500).json({ status: 'Failed', error: error.code, message: 'Failed SignIn' })
  }
}
exports.logout = async (req, res) => {
  const token = req.headers.authorization
  const decodedToken = await AuthenticationServices(token)
  const { uid: userId } = decodedToken
  try {
    await admin.auth().revokeRefreshTokens(userId)
    res.status(200).json({ status: 'Success', message: 'Success Logout' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'Failed', error: error.code ,message: 'Failed To Logout' })
  }
}

exports.resetPassword = async (req, res) => {
  const email = req.body.email
  try {
    const response = await sendPasswordResetEmail(auth, email)
    res.status(200).json({ status: 'Success', message: 'Link has been sent to your email', response })
  } catch (error) {
    res.status(500).json({ status: 'Failed', error: error.message })
  }
}

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refresh_token } = req.body

    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', refresh_token)

    const refreshingToken = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.API_KEY}`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    res.status(201).json({ status: 'Success', message: 'Refreshing Access Token Success', credential: refreshingToken.data.access_token })
  } catch (error) {
    res.status(403).json({ status: 'Failed', error: 'refresh token expired / invalid, please login' })
  }
}
