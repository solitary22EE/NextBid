// components/ViewUsersButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styling/ViewUsersButton.css';

const ViewUsersButton = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'admin') {
    return null; // Don't show button if not admin
  }

  return (
    <div className="view-users-container">
      <button className="view-users-btn" onClick={() => navigate('/admin')}>
        View All Users
      </button>
    </div>
  );
};

export default ViewUsersButton;
