const User = require('../models/User')
const generateToken = require('../utils/generateToken')


const registerUser = async(req,res) => {
    const {name, email, password, role} = req.body;

    if(await User.findOne({email})) return res.status(400).json({message:'User exists'})

        const user = await User.create({name, email, password, role})

        if (user) return res.status(201).json({
            _id: user.id, name: user.name, email: user.email,  role: user.role, token: generateToken(user._id)
        });
        res.status(400).json({message: 'Invalid data'})
}

const loginUser = async(req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email})
    if(user && await user.matchPassword(password)) {
        return res.json({
            _id:user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
        })
    }
    res.status(401).json({message: 'Invalid email or password'})
}

module.exports = {registerUser, loginUser}