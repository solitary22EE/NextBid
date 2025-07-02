import React from 'react';
import '../Styling/Hero.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Welcome to BidApp</h1>
        <p>Bid on unique items in real-time. Find deals, win auctions, and sell your own treasures.</p>
        <Link to="/login" className="btn-primary">Start Bidding</Link>
      </div>
    </section>
  );
};

export default Hero;
