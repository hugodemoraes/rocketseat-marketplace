const jwt = require('jsonwebtoken')
const { secret } = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const {
    headers: { authorization }
  } = req

  if (!authorization) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authorization.split(' ')

  try {
    const { id } = await promisify(jwt.verify)(token, secret)

    req.userId = id

    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
