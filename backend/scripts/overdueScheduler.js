const cron = require('node-cron');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const config = require('../config/config');

module.exports = function () {
  cron.schedule(config.CRON_SCHEDULE, async () => {
    try {
      const now = new Date();
      const overdueRequests = await Request.find({
        status: 'issued',
        dueDate: { $lt: now },
        overdueNotified: false,
      }).populate('equipment'); //  only populate what exists

      for (const r of overdueRequests) {
        r.status = 'overdue';
        r.overdueNotified = true;
        await r.save();

        await Notification.create({
          user: r.user, // still store the user ID, no need to populate
          request: r._id,
          type: 'overdue',
          message: `Overdue: ${r.equipment.name}`,
        });

        console.log('Overdue created', r._id.toString());
      }
    } catch (e) {
      console.error('Overdue scheduler error:', e.message);
    }
  });
};
