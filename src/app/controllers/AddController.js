const Ad = require('../models/Ad')

class AddController {
  async index (req, res) {
    const {
      params: { page },
      query: { minPrice, maxPrice, title }
    } = req

    let filters = {}

    if (minPrice) {
      filters = { ...filters, price: { ...filters.price, $gte: minPrice } }
    }

    if (maxPrice) {
      filters = { ...filters, price: { ...filters.price, $lte: maxPrice } }
    }

    if (title) {
      filters = { ...filters, title: new RegExp(title, 'i') }
    }

    const ads = await Ad.paginate(filters, {
      page: page || 1,
      limit: 10,
      sort: '-createdAt',
      populate: ['author']
    })

    return res.json(ads)
  }

  async show (req, res) {
    const {
      params: { adId }
    } = req

    const ad = await Ad.findById(adId)

    return res.json(ad)
  }

  async store (req, res) {
    const { body, userId: author } = req

    const ad = await Ad.create({ ...body, author })

    return res.json(ad)
  }

  async update (req, res) {
    const {
      params: { adId },
      body
    } = req

    const ad = await Ad.findByIdAndUpdate(adId, body, {
      new: true
    })

    return res.json(ad)
  }

  async destroy (req, res) {
    const {
      params: { adId }
    } = req

    await Ad.findByIdAndDelete(adId)

    return res.send()
  }
}

module.exports = new AddController()
