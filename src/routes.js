const express = require('express')
const validate = require('express-validation')
const handle = require('express-async-handler')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const {
  UserController,
  SessionController,
  AddController,
  PurchaseController
} = require('./app/controllers')
const { User, Ad, Purchase, Session } = require('./app/validators')

routes.post('/users', validate(User), handle(UserController.store))
routes.post('/sessions', validate(Session), handle(SessionController.store))

routes.use(authMiddleware)

routes.get('/ads', handle(AddController.index))
routes.get('/ads/:adId', handle(AddController.show))
routes.post('/ads', validate(Ad), handle(AddController.store))
routes.put('/ads/:adId', validate(Ad), handle(AddController.update))
routes.delete('/ads/:adId', handle(AddController.destroy))

routes.post('/purchases', validate(Purchase), handle(PurchaseController.store))

module.exports = routes
