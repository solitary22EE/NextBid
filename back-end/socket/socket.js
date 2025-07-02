module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('joinAuction', (auctionId) => {
            socket.join(auctionId)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
            
        })
        
    })
}