import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/Styling/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminId, setAdminId] = useState(null); // assumed to be fetched from token or auth
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // assuming JWT token is stored here
        const response = await axios.get('http://localhost:3008/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // assumed stored at login
        setAdminId(loggedInUser?._id);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (userId === adminId) {
      alert("You cannot delete your own account!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3008/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
      setMessage('User deleted successfully.');
    } catch (error) {
  console.error('Error deleting user:', error.response?.data || error.message);
  setMessage(error.response?.data?.message || 'Failed to delete user.');
}

  };

  return (

    
    <div className="admin-dashboard">
      <h2>Admin Dashboard - User Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {message && <p className="message">{message}</p>}
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                      disabled={user._id === adminId}
                    >
                      {user._id === adminId ? "Cannot Delete" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
