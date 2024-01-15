// authenticationServices.js
const AuthenticationError = require('../exceptions/AuthenticationError')
const admin = require('firebase-admin')

const authenticate = async (credential) => {
  try {
    if (!credential) {
      throw new AuthenticationError('Token not provided')
    }

    const checkRevoked = true
    const token = credential.split(' ')[1]
    console.log('Received Token:', token)

    const decodedToken = await admin.auth().verifyIdToken(token, checkRevoked)
    console.log('Decoded Token:', decodedToken)

    return decodedToken
  } catch (error) {
    console.error('Authentication Error:', error)
    throw new AuthenticationError('Unauthenticate')
  }
}

module.exports = authenticate
