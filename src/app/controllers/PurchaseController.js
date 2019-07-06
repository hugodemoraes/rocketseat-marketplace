const Ad = require('../models/Ad')
const User = require('../models/User')
const { PurchaseMail } = require('../jobs')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const {
      body: { adId, content },
      userId
    } = req

    const ad = await Ad.findById(adId).populate('author')
    const user = await User.findById(userId)

    Queue.create(PurchaseMail.key, {
      ad,
      user,
      content
    }).save()

    return res.send()
  }
}

module.exports = new PurchaseController()
