const express = require('express');
const {
  createAuction,
  getLiveAuction,
  getAuctionById,
  placeBid,
  getAllAuctions, // ✅ Import here
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const Auction = require('../models/Auction');

const router = express.Router();

// Create a new auction (protected)
router.post('/create', protect, createAuction);

//  Get all auctions regardless of status
router.get('/', getAllAuctions);

// Get all live auctions
router.get('/live', getLiveAuction);

// Get a specific auction by ID
router.get('/:id', getAuctionById);

// Place a bid (protected)
router.post('/:id/bid', protect, placeBid);

// End auction manually
router.put('/:id/end', protect, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('bids.user');

    if (!auction || auction.status === 'ended') {
      return res.status(400).json({ message: 'Auction already ended or not found' });
    }

    auction.status = 'ended';

    const highestBid = auction.bids.reduce(
      (max, bid) => (bid.amount > max.amount ? bid : max),
      { amount: 0 }
    );

    if (highestBid && highestBid.user) {
      auction.winner = {
        name: highestBid.user.name,
        bidAmount: highestBid.amount,
      };
    }

    const updatedAuction = await auction.save();

    res.json({
      message: 'Auction ended successfully.',
      updatedAuction,
      allBids: auction.bids,
    });
  } catch (err) {
    console.error('Error ending auction:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
