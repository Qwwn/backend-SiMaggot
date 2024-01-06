// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
}

const app = initializeApp(firebaseConfig)

module.exports = app
