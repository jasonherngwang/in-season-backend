// Wipe and re-seed the database with an admin and trial account
// Pass passwords via CLI (2 arguments)
// ts-node src/data/seed.ts adminPassword trialPassword
import config from '../utils/config';
import mongoose from 'mongoose';
import { UserModel } from '../models/user';
import userService from '../services/userService';

const clearDb = async () => {
  console.log('deleting all users');
  await UserModel.deleteMany({});
  console.log('db cleared');
};

const seedUsers = async () => {
  console.log('adding admin');
  await userService.addUser({
    username: 'admin',
    password: process.argv[2],
  });

  console.log('adding trial user');
  await userService.addUser({
    username: 'trial',
    password: process.argv[3],
  });

  console.log('all seed users added');
};

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .then(() => clearDb())
  .then(() => seedUsers())
  .then(() => mongoose.connection.close())
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
