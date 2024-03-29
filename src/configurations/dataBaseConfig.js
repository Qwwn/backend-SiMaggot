const Firestore = require('@google-cloud/firestore')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const path = require('path')
const serviceKey = path.join(__dirname, '../../credentials.json')

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: serviceKey
})

module.exports = db
