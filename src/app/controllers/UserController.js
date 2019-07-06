const User = require('../models/User')

class UserController {
  async store (req, res) {
    const { body } = req

    if (await User.findOne({ email: body.email })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await User.create(body)

    return res.json(user)
  }
}

module.exports = new UserController()
