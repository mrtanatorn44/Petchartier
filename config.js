require('dotenv').config()

module.exports = {
    prefix: '!',
    token: process.env.TOKEN,
    rapid_api_key: process.env.RAPID_API_KEY
  };