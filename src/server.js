require('dotenv').config()

const express = require('express')
const validate = require('express-validation')
const mongoose = require('mongoose')
const Youch = require('youch')
const Sentry = require('@sentry/node')

const databaseConfig = require('./config/database')
const sentryConfig = require('./config/sentry')

const isProduction = process.env.NODE_ENV === 'production'

class App {
  constructor () {
    this.express = express()
    this.isDev = !isProduction

    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    this.exceptions()
  }

  sentry () {
    Sentry.init(sentryConfig)
  }

  database () {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares () {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exceptions () {
    if (!isProduction) {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (!isProduction) {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      return res.status(err.status || 500).json({
        error: 'Internal Server Error'
      })
    })
  }
}

module.exports = new App().express
