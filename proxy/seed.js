const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/school_equipment_lending';
mongoose
  .connect(MONGO)
  .then(async () => {
    await User.deleteMany({});
    await User.create({
      name: 'Admin User',
      email: 'admin@school.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    });
    await User.create({
      name: 'Staff User',
      email: 'staff@school.com',
      password: await bcrypt.hash('staff123', 10),
      role: 'staff',
    });
    await User.create({
      name: 'Student User',
      email: 'student@school.com',
      password: await bcrypt.hash('student123', 10),
      role: 'student',
    });
    console.log('proxy seed done');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
