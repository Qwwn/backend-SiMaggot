const admin = require('firebase-admin')

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
module.exports = authenticate
