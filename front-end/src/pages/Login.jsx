import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Styling/login.css';
import axios from 'axios';
import Waves from '../../ReactBits/Waves/Waves';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('http://localhost:3008/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password';
      setErrorMessage(message);

      // Optional: Auto-dismiss after 4 seconds
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  return (
    <div className="login-page">
      <Waves
        lineColor="#2196f3"
        backgroundColor="#e3f2fd"
        waveSpeedX={0.008}
        waveSpeedY={0.004}
      />

      <div className="login-container">
        <div className="login-card">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="btn">
              <input type="submit" value="Log In" />
            </div>
          </form>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
