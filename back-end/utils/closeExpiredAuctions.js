const Auction = require('../models/Auction');

const closeExpiredAuctions = async () => {
    const now = new Date();
    try {
        const auctions = await Auction.find({ endTime: { $lte: now }, status: 'live' });

        for (const auction of auctions) {
            auction.status = 'ended';

            const winnerBid = auction.bids.sort((a, b) => b.amount - a.amount)[0];
            auction.winner = winnerBid?.user || null;

            await auction.save();
        }
    } catch (error) {
        console.error("Error in closeExpiredAuctions:", error.message);
    }
};

module.exports = closeExpiredAuctions;
