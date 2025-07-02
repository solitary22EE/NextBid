import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

  useEffect(() => {
    fetchAuctionDetails();
  }, []);

  useEffect(() => {
    if (auction) {
      const now = new Date();
      const start = new Date(auction.startTime);
      const end = new Date(auction.endTime);

      let status = '';
      if (now < start) {
        status = 'upcoming';
      } else if (now >= start && now <= end) {
        status = 'live';
      } else {
        status = 'ended';
      }

      if (status !== auction.status) {
        setAuction((prev) => ({ ...prev, status }));
        if (status === 'ended') {
          endAuction();
        }
      }
    }
  }, [auction]);

  const fetchAuctionDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3008/api/auction/${id}`);
      setAuction(res.data.auction);
      setBids(res.data.allBids);
    } catch (err) {
      console.error('Error fetching auction details:', err);
      setError('Failed to load auction details.');
    } finally {
      setLoading(false);
    }
  };

  const endAuction = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:3008/api/auction/${id}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAuction(res.data.updatedAuction);
      setBids(res.data.allBids);
    } catch (err) {
      console.error('Failed to end auction:', err);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');

    const bid = parseFloat(bidAmount);
    const current = parseFloat(auction.currentPrice);

    if (isNaN(bid) || bid <= current) {
      setBidError(`Amount must be higher than current price (₹${current})`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3008/api/auction/${id}/bid`,
        { amount: bidAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBidSuccess('Bid placed successfully!');
      setBidAmount('');
      fetchAuctionDetails();
    } catch (err) {
      console.error('Bid error:', err);
      setBidError(err.response?.data?.message || 'Failed to place bid.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // ✅ Redirect to dashboard
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading auction details...</p>
      </Container>
    );
  }

  if (error || !auction) {
    return (
      <Container className="mt-5 text-center text-danger">
        <h4>{error || 'Auction not found.'}</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {/* ✅ Back to Dashboard Button */}
      <div className="mb-3">
        <Button variant="secondary" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </Button>
      </div>

      <Card>
        <Card.Img
          variant="top"
          src={auction.image ? auction.image : 'https://via.placeholder.com/600x300?text=No+Image'}
          alt="Auction Item"
        />
        <Card.Body>
          <Card.Title>{auction.title}</Card.Title>
          <Card.Text><strong>Description:</strong> {auction.description}</Card.Text>
          <Card.Text><strong>Base Price:</strong> ₹{auction.basePrice}</Card.Text>
          <Card.Text><strong>Current Price:</strong> ₹{auction.currentPrice}</Card.Text>
          <Card.Text><strong>Status:</strong> {auction.status}</Card.Text>
          <Card.Text><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</Card.Text>

          {auction.status === 'ended' && auction.winner && (
            <Card.Text className="text-success">
              <strong>Winner:</strong> {auction.winner.name} <br />
              <strong>Winning Bid:</strong> ₹{bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : auction.basePrice}
            </Card.Text>
          )}

          {auction.status === 'live' && (
            <>
              <Button variant="primary" onClick={() => setShowBidForm(!showBidForm)}>
                {showBidForm ? 'Cancel' : 'Place a Bid'}
              </Button>

              {showBidForm && (
                <Form className="mt-3" onSubmit={handleBidSubmit}>
                  <Form.Group controlId="bidAmount">
                    <Form.Label>Enter Your Bid (₹):</Form.Label>
                    <Form.Control
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                      min={auction.currentPrice + 1}
                    />
                  </Form.Group>
                  <Button className="mt-2" type="submit" variant="success">Submit Bid</Button>
                </Form>
              )}
            </>
          )}

          {bidError && <Alert className="mt-3" variant="danger">{bidError}</Alert>}
          {bidSuccess && <Alert className="mt-3" variant="success">{bidSuccess}</Alert>}

          {bids.length > 0 && (
            <div className="mt-4">
              <h5>Bid History</h5>
              <ul className="list-group">
                {bids.map((bid) => (
                  <li key={bid._id} className="list-group-item">
                    ₹{bid.amount} by {bid.user.name} at {new Date(bid.time).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuctionDetail;
