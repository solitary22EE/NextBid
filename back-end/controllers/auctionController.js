const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

//  Create Auction
const createAuction = async (req, res) => {
  const { title, description, basePrice, startTime, endTime } = req.body;

  if (!title || !description || !basePrice || !startTime || !endTime) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  try {
    const now = new Date();
    let status = 'upcoming';
    if (now >= new Date(startTime) && now <= new Date(endTime)) {
      status = 'live';
    } else if (now > new Date(endTime)) {
      status = 'ended';
    }

    const auction = await Auction.create({
      title,
      description,
      basePrice,
      currentPrice: basePrice,
      startTime,
      endTime,
      seller: req.user._id,
      status
    });

    res.status(201).json(auction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Get All Live Auctions and Update Statuses
const getLiveAuction = async (req, res) => {
  const now = new Date();

  try {
    const allAuctions = await Auction.find();

    for (const auction of allAuctions) {
      let updated = false;

      if (now < auction.startTime && auction.status !== 'upcoming') {
        auction.status = 'upcoming';
        updated = true;
      } else if (now >= auction.startTime && now <= auction.endTime && auction.status !== 'live') {
        auction.status = 'live';
        updated = true;
      } else if (now > auction.endTime && auction.status !== 'ended') {
        auction.status = 'ended';

        // Determine winner if bids exist
        if (auction.bids.length > 0) {
          const highestBid = auction.bids.reduce((max, bid) =>
            bid.amount > max.amount ? bid : max, auction.bids[0]
          );
          auction.winner = highestBid.user;
        }

        updated = true;
      }

      if (updated) await auction.save();
    }

    const liveAuctions = await Auction.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: 'live',
    });

    res.json(liveAuctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get All Auctions (Live, Ended, Upcoming)
const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .sort({ createdAt: -1 })
      .populate('winner', 'name');

    res.json(auctions);
  } catch (error) {
    console.error('Error fetching all auctions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


//  Get Auction by ID (with embedded and stored bids)
const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'name')
      .populate('winner', 'name')
      .populate('bids.user', 'name');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const allBids = await Bid.find({ auction: req.params.id }).populate('user', 'name');

    res.json({ auction, allBids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Place a Bid
const placeBid = async (req, res) => {
  const { amount } = req.body;
  const now = new Date();

  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction || auction.status !== 'live' || now < auction.startTime || now > auction.endTime) {
      return res.status(400).json({ message: 'Auction is not live' });
    }

    if (amount <= auction.currentPrice) {
      return res.status(400).json({ message: 'Bid must be higher than current price' });
    }

      // Debug log to check which user is placing the bid
    //console.log("Bidding user ID:", req.user._id);

    const bid = new Bid({
      user: req.user._id,
      auction: auction._id,
      amount,
      time: now
    });

    await bid.save();
    await bid.populate('user', 'name'); 

    auction.bids.push({
      user: req.user._id,
      amount,
      time: now
    });

    auction.currentPrice = amount;
    await auction.save();

    if (req.io) {
      req.io.to(auction._id.toString()).emit('newBid', bid); //  Now bid.user.name will be available
    }

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAuction,
  getLiveAuction,
  getAuctionById,
  placeBid,
  getAllAuctions 
};
