/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const admin = require('../configurations/fireBaseAdminConfig')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth')
const app = require('../configurations/firebaseConfig')
const AuthenticationServices = require('../services/authenticationServices')
const axios = require('axios')
const bcrypt = require('bcrypt')
const params = new URLSearchParams()
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
    res.status(200).json({ status: 'Success', message: 'Berhasil Daftar', data: responses })
  } catch (error) {
    res.status(500).json({ status: 'Failed', message: 'Gagal Daftar', error: error.code })
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
    res.status(200).json({ status: 'Success', message: 'Berhasil Masuk', credential, refreshToken })
  } catch (error) {
    res.status(500).json({ status: 'Failed', error: error.code, message: 'Gagal Masuk' })
  }
}
exports.logout = async (req, res) => {
  const token = req.headers.authorization

  try {
    // Authenticate the token and get the user ID
    const decodedToken = await AuthenticationServices(token)

    // Check if decodedToken is null or undefined
    if (!decodedToken) {
      return res.status(401).json({ status: 'Failed', message: 'Token tidak valid' })
    }

    const { uid: userId } = decodedToken

    // Revoke refresh tokens
    await admin.auth().revokeRefreshTokens(userId)

    res.status(200).json({ status: 'Success', message: 'Berhasil Keluar' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'Failed', error: error.code, message: 'Gagal Keluar' })
  }
}

exports.resetPassword = async (req, res) => {
  const email = req.body.email
  try {
    const response = await sendPasswordResetEmail(auth, email)
    res.status(200).json({ status: 'Success', message: 'Tauatan sudah dikirim ke email anda', response })
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

    res.status(201).json({ status: 'Success', message: 'Refreshing Access Token Berhasil', credential: refreshingToken.data.access_token })
  } catch (error) {
    res.status(403).json({ status: 'Failed', error: 'refresh token kadaluarsa / tidak valid, masuk ulang' })
  }
}
