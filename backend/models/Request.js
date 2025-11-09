const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  uname: {
  type: String,
  required: false
   },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true,
  },
  quantity: { type: Number, required: true },
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'issued', 'overdue', 'returned'],
    default: 'pending',
  },
  notes: String,
  overdueNotified: { type: Boolean, default: false },
  approvedBy: String,
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
