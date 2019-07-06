const Joi = require('joi')

module.exports = {
  body: {
    adId: Joi.string().required(),
    content: Joi.string().required()
  }
}
