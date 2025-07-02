const jwt = require('jsonwebtoken')

module.exports = (id) => {
    return jwt.sign({id}, process.env.JWt_SECRET, {expiresIn: '2h'})
}