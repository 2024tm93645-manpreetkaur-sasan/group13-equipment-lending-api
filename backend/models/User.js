const mongoose = require('mongoose');
const s = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  },
  { timestamps: true }
);
module.exports = require('mongoose').model('User', s);
