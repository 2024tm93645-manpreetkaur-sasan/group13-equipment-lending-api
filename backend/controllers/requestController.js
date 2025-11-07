const Request = require('../models/Request');
const Equipment = require('../models/Equipment');
const Notification = require('../models/Notification');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');

async function hasOverlap(equip, from, to, exclude) {
  const q = {
    equipment: equip,
    status: { $in: ['approved', 'issued'] },
    $or: [
      { issueDate: { $lte: to, $gte: from } },
      { dueDate: { $lte: to, $gte: from } },
      { issueDate: { $lte: from }, dueDate: { $gte: to } },
    ],
  };

  if (exclude) q._id = { $ne: new mongoose.Types.ObjectId(exclude) };

  return (await Request.countDocuments(q)) > 0;
}


exports.request = async (req, res) => {
  try {
    const uid = req.user && req.user.id;
    if (!uid)
      return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'unauthorized' });

    const { equipment, quantity, from, to, notes } = req.body;

    const eq = await Equipment.findById(equipment);
    if (!eq)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Equipment not found' });

    if (quantity > eq.available)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'not enough available' });

    if (await hasOverlap(equipment, new Date(from), new Date(to)))
      return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'booking conflict' });

    const r = await Request.create({
      user: uid, // Just storing the ID from proxy
      equipment,
      quantity,
      issueDate: new Date(from),
      dueDate: new Date(to),
      notes,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: 'request created', data: r });

  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};

exports.approve = async (req, res) => {
  const id = req.params.id;
  const r = await Request.findById(id);

  if (!r) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'not found' });

  if (await hasOverlap(r.equipment, r.issueDate, r.dueDate, id))
    return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'conflict' });

  r.status = 'approved';
  r.approvedBy = req.user.id;
  await r.save();

  return res.status(StatusCodes.OK).json({ success: true, message: 'approved', data: r });
};

exports.reject = async (req, res) => {
  const id = req.params.id;
  const r = await Request.findById(id);

  if (!r) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'not found' });

  r.status = 'rejected';
  r.approvedBy = req.user.id;
  await r.save();

  return res.status(StatusCodes.OK).json({ success: true, message: 'rejected', data: r });
};


exports.issue = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Request.findById(id);
    if (!r) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'not found' });
    if (r.status !== 'approved')
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'invalid status' });

    const eq = await Equipment.findById(r.equipment);
    if (eq.available < r.quantity)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'not enough available' });

    eq.available -= r.quantity;
    await eq.save();

    r.status = 'issued';
    r.issueDate = new Date();
    r.dueDate = new Date(r.issueDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    await r.save();

    return res.status(StatusCodes.OK).json({ success: true, message: 'issued', data: r });

  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};

exports.return = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Request.findById(id);
    if (!r) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'not found' });
    if (r.status !== 'issued' && r.status !== 'overdue')
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'invalid status' });

    const eq = await Equipment.findById(r.equipment);
    eq.available += r.quantity;
    await eq.save();

    r.status = 'returned';
    r.returnDate = new Date();
    await r.save();

    return res.status(StatusCodes.OK).json({ success: true, message: 'returned', data: r });

  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const q = {};
    if (!['admin', 'staff'].includes(req.user.role)) {
            q.user = req.user.id;
    }

    const items = await Request.find(q)
      .populate('equipment') // only populate equipment
      .lean();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'requests list',
      data: items,
    });

  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};
