const db = require('../configurations/dataBaseConfig')
const gc = require('../configurations/storageConfig')
const bucket = gc.bucket('si-maggot-seller')
const NotFoundError = require('../exceptions/NotFoundError')

class UserServices {
  constructor () {
    this._db = db
  }

  async getUserById(id) {
    try {
      const querySnapshot = await db.collection('users').where('id', '==', id).get()
  
      let userData = null
      querySnapshot.forEach((doc) => {
        userData = doc.data()
      })
      if (!userData) {
        throw new NotFoundError('User not found')
      }
  
      return userData
    } catch (error) {
      throw error
    }
  }

  async addUser (data) {
    try {
      const doc = db.collection('users').doc(data.email)
      await doc.set(data)
      console.log('user berhasil dibuat')
    } catch (error) {
      throw error
    }
  }

  async uploadUserImage(filename, buffer) {
    try {
      const file = bucket.file(filename)
      await file.save(buffer)
      return file.name
    } catch (error) {
      return error
    }
  }

  async updateUser(payload, userId, userEmail) {
    try {
      if (payload.cover !== undefined) {
        const { cover: { originalname, buffer } } = payload
        const filename = `${userId}_${originalname}`
        const file = await this.uploadUserImage(filename, buffer)
        const imageUrl = `${process.env.GS_URL_USER}/${file}`
        payload.cover = imageUrl
      }
      const doc = db.collection('users').doc(userEmail)
      await doc.update(payload)
    } catch (error) {
      throw error
    }
  }

  async deleteUserImage (data) {
    try {
      const filename = await Promise.all(data.docs.map(async (doc) => {
        const userData = doc.data()
        const coverFile = userData.cover.split('/').pop()
        return coverFile
      }))
      const file = bucket.file(filename)
  
      const exists = await file.exists()
  
      if (exists[0]) {
        await file.delete()
      } else {
        throw new NotFoundError('Image File Not Found')
      }
    } catch (error) {
      throw error
    }
  }
}
module.exports = UserServices
