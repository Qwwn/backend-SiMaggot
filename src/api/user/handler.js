const { nanoid } = require('nanoid')
const admin = require('../../configurations/fireBaseAdminConfig')
const CartServices = require('../../services/cartServices')
const cartServices = new CartServices()
class UserHandler {
  constructor (services, validator) {
    this._service = services
    this._cartService = cartServices
    this._validator = validator
  }

  async postUserHandler (payload, image) {
    await this._validator.validatePostUserPayload(payload)
    const userRecord = await admin.auth().createUser({
      displayName: payload.username,
      email: payload.email,
      password: payload.password,
      emailVerified: true,
      disabled: false
    })

    if (image !== undefined) {
      const filename = `${userRecord.uid}_${image.originalname}`
      const buffer = image.buffer
      const file = await this._service.uploadUserImage(filename, buffer)
      const imageUrl = `${process.env.GS_URL_USER}/${file}`
      await admin.auth().updateUser(userRecord.uid, {
        photoURL: imageUrl 
      })
      payload.cover = imageUrl
    }
    const { password, ...newObject } = payload 
    const user = {
      ...newObject,
      id: userRecord.uid
    }

    const cartData = {
      id: `cart-${nanoid(16)}`,
      userId: userRecord.uid,
      products: []
    }
    await this._service.addUser(user)
    await this._cartService.addCart(cartData)
    return user.id
  }

  async getUserByUserIdHandler(userId) {
    const user = await this._service.getUserById(userId)
    return user
  }

  async updateUserHandler(payload, userId, userEmail) {
    try {
      const cover = payload.cover !== undefined ? payload.cover : undefined
      await this._validator.validatePutUserPayload(payload)
  
      if (cover !== undefined) payload.cover = cover
      const { ...newObject } = payload
      await this._service.updateUser(newObject, userId, userEmail)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
module.exports = UserHandler
