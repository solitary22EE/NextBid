const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema ({
    name : {
        type: String,
        required : [true,'Please enter your name'],
    },
    email: {
        type: String,
        unique: true,
        required: [true,'Please enter your email'],
    },
    password: {
        type: String,
        required: [true,'Please enter your password'],
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        

    }
},{timestamps: true})

//password hashing

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User',userSchema)