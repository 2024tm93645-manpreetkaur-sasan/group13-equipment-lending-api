// backend/scripts/seed.js
(async function () {
  // connectDB should export a function that returns a Promise
  const connectDB = require('../config/database.js');
  const mongoose = require('mongoose');

  // backend models (these exist)
  const Equipment = require('../models/Equipment.js');
  const Request = require('../models/Request.js');

  try {
    // connect
    await connectDB();

    // get raw collection access for users (users are managed by proxy)
    const usersColl = mongoose.connection.collection('users');

    // clear existing backend collections (equipments and requests)
    await Equipment.deleteMany({});
    await Request.deleteMany({});

    // create equipments
    const e1 = await Equipment.create({
      name: 'Soccer Ball',
      category: 'sports',
      condition: 'good',
      quantity: 10,
      available: 10,
    });

    const e2 = await Equipment.create({
      name: 'DSLR Camera',
      category: 'camera',
      condition: 'good',
      quantity: 2,
      available: 2,
    });

    // lookup users created by proxy in the 'users' collection
    const admin = await usersColl.findOne({ email: 'admin@school.com' });
    const staff = await usersColl.findOne({ email: 'staff@school.com' });
    const student = await usersColl.findOne({ email: 'student@school.com' });

    // If you don't have these users in proxy DB, bail out and tell the user
    if (!admin || !staff || !student) {
      console.error(
        '\nRequired users not found in `users` collection. Please ensure proxy has these seeded:\n' +
        "admin@school.com, staff@school.com, student@school.com\n" +
        'Found ->',
        {
          admin: !!admin,
          staff: !!staff,
          student: !!student,
        }
      );
      process.exit(1);
    }

    const now = new Date();

    // create one overdue issued request (so scheduler can detect overdue)
    await Request.create({
      user: student._id.toString ? student._id : student._id, // keep as stored type
      equipment: e2._id,
      quantity: 1,
      issueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      status: 'issued',
      approvedBy: staff._id ? staff._id : staff._id,
    });

    // create one future approved request
    await Request.create({
      user: student._id.toString ? student._id : student._id,
      equipment: e1._id,
      quantity: 1,
      issueDate: new Date(now.getTime() + 1 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'approved',
      approvedBy: staff._id ? staff._id : staff._id,
    });

    console.log('Backend seed done.');
    console.log('equipments:', e1._id.toString(), e2._id.toString());
    console.log('users found:', {
      admin: admin._id ? admin._id.toString() : admin._id,
      staff: staff._id ? staff._id.toString() : staff._id,
      student: student._id ? student._id.toString() : student._id,
    });

    // close mongoose connection cleanly
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(1);
  }
})();
