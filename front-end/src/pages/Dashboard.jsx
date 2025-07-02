import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await axios.get('http://localhost:3008/api/auction');
      const updatedAuctions = res.data.map(auction => {
        const now = new Date();
        const start = new Date(auction.startTime);
        const end = new Date(auction.endTime);

        if (now < start) {
          auction.status = 'upcoming';
        } else if (now >= start && now <= end) {
          auction.status = 'live';
        } else {
          auction.status = 'ended';
        }

        return auction;
      });

      setAuctions(updatedAuctions);
    } catch (err) {
      console.error('Failed to fetch auctions:', err);
      setError('Error fetching auctions.');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = (auction) => {
    if (auction.status === 'upcoming') {
      const startTime = auction.startTime
        ? new Date(auction.startTime).toLocaleString()
        : 'Unknown time';
      alert(`This auction is upcoming and will start at: ${startTime}`);
      return;
    }

    if (auction.status === 'ended') {
      const endedTime = auction.endTime
        ? new Date(auction.endTime).toLocaleString()
        : 'Unknown time';
      alert(`This auction has ended at: ${endedTime}`);
      return;
    }

    navigate(`/auction/${auction._id}`);
  };

  const handleCreateAuction = () => {
    navigate('/create-auction');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div>Loading Auctions...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center text-danger">
        <h4>{error}</h4>
      </Container>
    );
  }

  return (


    
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Auctions</h2>
        <Button variant="success" onClick={handleCreateAuction}>
          + Create New Auction
        </Button>
      </div>

      <Row className="g-4">
        {auctions.length === 0 ? (
          <p className="text-center">No auctions available.</p>
        ) : (
          auctions.map((auction) => (
            <Col key={auction._id} sm={12} md={6} lg={4}>
              <Card style={{ width: '100%' }}>
                <Card.Img
                  variant="top"
                  src={
                    auction.image
                      ? auction.image
                      : 'https://via.placeholder.com/300x180?text=No+Image'
                  }
                  alt={auction.title || 'Auction image'}
                />
                <Card.Body>
                  <Card.Title>{auction.title || 'Untitled Auction'}</Card.Title>
                  <Card.Text>{auction.description || 'No description available'}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>
                    Starting Price: ₹{auction.basePrice || 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Highest Bid: ₹{auction.currentPrice || auction.basePrice || 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    End Time:{' '}
                    {auction.endTime
                      ? new Date(auction.endTime).toLocaleString()
                      : 'N/A'}
                  </ListGroup.Item>
                  <ListGroup.Item>Status: {auction.status}</ListGroup.Item>

                  {/* ✅ Show Winner Info Only for Ended Auctions */}
                  {auction.status === 'ended' && auction.winner && (
                    <>
                      <ListGroup.Item className="text-success fw-bold">
                        Winner: {auction.winner.name || 'Anonymous'}
                      </ListGroup.Item>
                      <ListGroup.Item className="text-success fw-bold">
                        Winning Bid: ₹{auction.currentPrice}
                      </ListGroup.Item>
                    </>
                  )}
                </ListGroup>
                <Card.Body className="d-flex justify-content-center">
                  <Button variant="primary" onClick={() => handleParticipate(auction)}>
                    Participate
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Dashboard;
