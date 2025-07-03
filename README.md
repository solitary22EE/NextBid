# 🛍️ NextBid - Online Auction Website

NextBid is a full-featured **MERN stack** online auction platform where users can register, list items for auction, and place live bids securely. It includes token-based authentication, role-based access (user/admin), bidding timers, and automatic winner selection after the auction ends.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- React.js (with Vite)
- Bootstrap 5
- React Router DOM
- Axios
- Context API

### 🗄️ Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- Bcrypt.js
- dotenv

---

## 🧰 Features

### 👤 User Features
- User registration and login with JWT
- Browse live auctions
- Place bids in real-time
- View auction details and history
- View personal bidding history
- Winner display after auction ends

### 🛠️ Admin Features
- Secure admin login
- Create, update, delete auctions
- View all users and bidders
- Monitor bidding activity
- Assign winners automatically

### ⏱️ Auction System
- Countdown timer for each auction
- Automatic highest bidder detection
- Result displayed post auction end time
- Bids allowed only within auction period
- Secure token-based bidding authentication


---

## 🛠️ Installation and Setup

### 🔧 Backend

1. Navigate to the backend folder:
   ```bash
   cd back-end
2. Run the command:
   ```bash
   node --watch server.js

### 💻 Frontend

1. Navigate to the frontend folder:
    ```bash
    cd front-end
2. Run the command:
   ```bash
   npm run dev


```bash
touch .env
```

# Add the following in .env
```bash
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=superSecretKey123 
PORT=3008


