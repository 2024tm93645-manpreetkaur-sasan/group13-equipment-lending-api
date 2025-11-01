(async function () {
  const connect = require('../config/database')();
  const User = require('../models/User');
  const Equipment = require('../models/Equipment');
  const Request = require('../models/Request');
  try {
    await connect;
    await User.deleteMany({});
    await Equipment.deleteMany({});
    await Request.deleteMany({});
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@school.com',
      role: 'admin',
    });
    const staff = await User.create({
      name: 'Staff User',
      email: 'staff@school.com',
      role: 'staff',
    });
    const student = await User.create({
      name: 'Student User',
      email: 'student@school.com',
      role: 'student',
    });
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
    const now = new Date();
    const r1 = await Request.create({
      user: student._id,
      equipment: e2._id,
      quantity: 1,
      issueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      status: 'issued',
      approvedBy: staff._id,
    });
    const r2 = await Request.create({
      user: student._id,
      equipment: e1._id,
      quantity: 1,
      issueDate: new Date(now.getTime() + 1 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'approved',
      approvedBy: staff._id,
    });
    console.log(
      'backend seed done',
      admin._id.toString(),
      staff._id.toString(),
      student._id.toString()
    );
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
