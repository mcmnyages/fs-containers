
const mongoose = require('mongoose')
const dns = require('dns')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

dns.setServers(['1.1.1.1', '8.8.8.8'])

mongoose
  .connect(config.MONGO_URL, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')

    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`)
    })
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })
