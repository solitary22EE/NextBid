const User = require('../models/User')
const Auction = require('../models/Auction')


const getAllUsers = async(req,res) => {
    const users = await User.find().select('-password')
    res.json(users)
}
const deleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Prevent deleting yourself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete self' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};


module.exports = {getAllUsers, deleteUser}