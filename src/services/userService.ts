import bcrypt from 'bcrypt';
import fs from 'fs';
import { ValidationError } from '../utils/errors';
import { NewUserEntry, NewFoodEntry } from '../types';
import { IUser, UserModel } from '../models/user';

const getUser = async (id: string) => {
  const user = await UserModel.findById(id);
  return user;
};

const getTrialUser = async () => {
  const user = await UserModel.findOne({ username: 'trial' });
  return user;
};

const addUser = async (entry: NewUserEntry) => {
  const { username, password } = entry;

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    throw new ValidationError(
      `username must be unique; ${username} already exists`,
    );
  }

  // Hash plaintext password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Make a copy of the "core" foods for the user
  const foods: NewFoodEntry[] = JSON.parse(
    fs.readFileSync(`${__dirname}/../../data/seedData.json`, 'utf-8'),
  );

  const newUser = new UserModel({
    username,
    passwordHash,
    foods,
  });

  const addedUser: IUser | null = await newUser.save();
  return addedUser;
};

const deleteUser = async (id: string) => {
  console.log('deleting');
  await UserModel.findByIdAndDelete(id);
};

export default {
  getUser,
  getTrialUser,
  addUser,
  deleteUser,
};
