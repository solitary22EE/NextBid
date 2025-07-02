const Auction = require('../models/Auction')


const getUserBids = async(req,res) => {
    const auctions = await Auction.find({'bids.user': req.user._id})
    .select('title bids').populate('bids.user','name')

    const bids = auctions.reduce((acc,a) => {
        a.bids.forEach(b => {
            if(b.user.equals(req.user._id)) acc.push({auction: a._id, title: a.title, amount: b.amount, time: b.time})
        })
    return acc

    }, [])

    res.json(bids)
}


module.exports = {getUserBids}