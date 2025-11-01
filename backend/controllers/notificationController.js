const Notification = require('../models/Notification');
const { StatusCodes } = require('http-status-codes');
exports.list = async (req, res) => {
  try {
    if (!req.user)
      return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'unauthorized' });
    const n = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.status(StatusCodes.OK).json({ success: true, message: 'notifications', data: n });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
  }
};
