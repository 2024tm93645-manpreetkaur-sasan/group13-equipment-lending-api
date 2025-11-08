const Equipment = require('../models/Equipment');
const { StatusCodes } = require('http-status-codes');

exports.list = async (req, res) => {
  try {
    const f = {};
    if (req.query.category) f.category = req.query.category;
    if (req.query.available) f.available = { $gte: Number(req.query.available) };
    const items = await Equipment.find(f).lean();
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'equipment list', data: items });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
  console.log('Attempting to create equipment...'); // Add this
    const it = await Equipment.create(req.body);
    console.log('Equipment created successfully!'); // Add this
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: 'equipment created', data: it });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!it)
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'not found' });
    return res.status(StatusCodes.OK).json({ success: true, message: 'updated', data: it });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    return res.status(StatusCodes.OK).json({ success: true, message: 'deleted' });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};
