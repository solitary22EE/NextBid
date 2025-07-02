import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CreateAuction() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    highestPrice: '',
    startTime: '',
    endTime: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, basePrice, highestPrice, startTime, endTime } = formData;

    if (!title || !description || !basePrice || !startTime || !endTime) {
      setError('Please fill in all required fields.');
      return;
    }

    if (highestPrice && Number(highestPrice) < Number(basePrice)) {
      setError('Highest Price cannot be less than Start Price.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3008/api/auction/create',
        {
          title,
          description,
          basePrice: Number(basePrice),
          highestPrice: highestPrice ? Number(highestPrice) : Number(basePrice),
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Auction created:', response.data);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        basePrice: '',
        highestPrice: '',
        startTime: '',
        endTime: ''
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error creating auction:', err);
      setError(err.response?.data?.message || 'Failed to create auction.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">Create Auction</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Auction created successfully!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasePrice">
          <Form.Label>Start Price (₹)</Form.Label>
          <Form.Control
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
            min="1"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formHighestPrice">
          <Form.Label>Initial Highest Price (₹)</Form.Label>
          <Form.Control
            type="number"
            name="highestPrice"
            value={formData.highestPrice}
            onChange={handleChange}
            min="1"
            placeholder="Leave blank to use Start Price"
          />
          <Form.Text className="text-muted">
            Must be equal to or greater than Start Price.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formStartTime">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEndTime">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Create Auction
        </Button>
      </Form>
    </Container>
  );
}

export default CreateAuction;
