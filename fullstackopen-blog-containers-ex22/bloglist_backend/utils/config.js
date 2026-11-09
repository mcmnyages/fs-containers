
require('dotenv').config()

const PORT = process.env.PORT || 3003

const MONGO_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_TEST_URL
    : process.env.MONGO_URL

const SECRET = process.env.SECRET

if (!MONGO_URL) {
  throw new Error(
    `Database URL is missing for NODE_ENV=${process.env.NODE_ENV}`
  )
}

if (!SECRET) {
  throw new Error(
    'SECRET is missing. Check that your .env file is loaded.'
  )
}

module.exports = {
  MONGO_URL,
  PORT,
  SECRET,
}
