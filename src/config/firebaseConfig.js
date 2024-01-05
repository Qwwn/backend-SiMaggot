// Import the functions you need from the SDKs you need
import { initializeApp } from firebase/app;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app
