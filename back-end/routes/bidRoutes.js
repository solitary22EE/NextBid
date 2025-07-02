const express = require('express')
const {getUserBids} = require('../controllers/bidController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()



router.get('/my-bids',protect, getUserBids)


module.exports = router