const mongoose = require('mongoose');
const s = new mongoose.Schema(
  {
    name: String,
    category: String,
    condition: { type: String, default: 'good' },
    quantity: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
  },
  { timestamps: true }
);
module.exports = require('mongoose').model('Equipment', s);
