const mongoose = require('mongoose');
const s = new mongoose.Schema(
  {
  user: {
      type: String,
      required: true,
    },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    type: String,
    message: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = require('mongoose').model('Notification', s);
