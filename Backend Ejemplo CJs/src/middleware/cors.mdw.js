const cors = require('cors')
require('dotenv').config()

const ACCEPTED_ORIGINS = [
  `${process.env.CORS}`,
  "",//url
];

const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true, 
})

module.exports = corsMiddleware