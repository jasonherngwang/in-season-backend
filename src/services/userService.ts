import bcrypt from 'bcrypt';
import { ValidationError } from '../utils/errors';
import { NewUserEntry } from '../types';
import { UserModel } from '../models/user';

const getUsers = async () => {
  const users = await UserModel.find({});
  return users;
};

const getUser = async (id: string) => {
  const user = await UserModel.findById(id).populate(['foods', 'baskets']);
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

  const newUser = new UserModel({
    username,
    passwordHash,
  });

  const addedUser = await newUser.save();
  return addedUser;
};

// Delete user along with their foods and baskets
const deleteUser = async (id: string) => {
  await UserModel.findByIdAndDelete(id);
};

export default {
  getUsers,
  getUser,
  addUser,
  deleteUser,
};
