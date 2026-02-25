const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create/Update Test Student
    const studentData = {
      name: 'E2E Student',
      email: 'student@e2e.com',
      password: hashedPassword,
      role: 'student',
      phone: '1234567890',
      authProvider: 'local',
      profileCompleted: true
    };

    const student = await User.findOneAndUpdate(
      { email: studentData.email },
      studentData,
      { upsert: true, new: true }
    );
    console.log('Test Student seeded:', student.email);

    // 2. Create/Update Test Owner
    const ownerData = {
      name: 'E2E Owner',
      email: 'owner@e2e.com',
      password: hashedPassword,
      role: 'owner',
      phone: '0987654321',
      hostelName: 'E2E Test Hostel',
      authProvider: 'local',
      profileCompleted: true
    };

    const owner = await User.findOneAndUpdate(
      { email: ownerData.email },
      ownerData,
      { upsert: true, new: true }
    );
    console.log('Test Owner seeded:', owner.email);

    // 3. Create/Update Test Hostel
    const hostelData = {
      name: 'E2E Testing Villa',
      owner: owner._id,
      location: 'Sheriguda, RR District',
      locality: 'Sheriguda',
      type: 'Boys',
      pricePerMonth: 6500,
      floors: 3,
      capacity: 50,
      amenities: ['WiFi', 'Food', 'Laundry'],
      description: 'Perfect for E2E testing automation.',
      isVerified: true
    };

    const hostel = await Hostel.findOneAndUpdate(
      { name: hostelData.name },
      hostelData,
      { upsert: true, new: true }
    );
    console.log('Test Hostel seeded:', hostel.name);

    // 4. Create a test room
    const roomData = {
      hostel: hostel._id,
      floor: 1,
      roomNumber: "101",
      capacity: 4,
      roomType: 'dormitory',
      status: 'available'
    };

    const room = await Room.findOneAndUpdate(
      { hostel: hostel._id, roomNumber: roomData.roomNumber },
      roomData,
      { upsert: true, new: true }
    );
    console.log('Test Room seeded:', room.roomNumber);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
