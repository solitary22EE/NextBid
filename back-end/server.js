require('dotenv').config();

const express = require('express')

const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

const mongoose = require('mongoose')

const closeExpiredAuctions = require('./utils/closeExpiredAuctions');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const auctionRotes = require('./routes/auctionRoutes')
const bidRoutes = require('./routes/bidRoutes')
const userRoutes = require('./routes/userRoutes')

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database connected..');
    
})
.catch((err) => {
    console.error(err);
    
})


const app = express()
app.use(cors());
app.use(express.json());



const port = process.env.PORT

app.use('/api/auth',authRoutes)
app.use('/api/auction',auctionRotes)
app.use('/api/bid',bidRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/users', userRoutes);

app.use(errorHandler)

const server = http.createServer(app)
const io = socketio(server, {cors: {orgin: '*'}})
app.set('io',io)

setInterval(closeExpiredAuctions, 30 * 1000)

app.listen(port,() => {
    console.log(`port ${port} is running.`);
    
})