import bcrypt from 'bcrypt';
import ValidationError from '../utils/errors';
import { NewUserEntry } from '../types';
// import { IUser, UserModel } from '../models/user';
import { IUser, UserModel } from '../models/user';

// // Get all
// const getUsers = async (): Promise<IUser[]> => {
//   const users = await UserModel.find({});
//   return users;
// };

// Get one
const getUser = async (id: string): Promise<IUser | null | undefined> => {
  const user = await UserModel.findById(id);
  return user;
};

// // Create one
const addUser = async (entry: NewUserEntry): Promise<IUser> => {
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

// // Update one
// const updateUser = async (
//   id: string,
//   entry: NewUserEntry,
// ): Promise<IUser | null | undefined> => {
//   const updatedUser = UserModel.findByIdAndUpdate(
//     id,
//     {
//       name: entry.name,
//       category: entry.category,
//       months: entry.months,
//       description: entry.description,
//       imageUrl: entry.imageUrl,
//     },
//     { new: true, runValidators: true, context: 'query' },
//   );

//   return updatedUser;
// };

// // Delete one
// const deleteUser = async (id: string): Promise<void> => {
//   await UserModel.findByIdAndDelete(id);
// };

export default {
  // getUsers,
  getUser,
  addUser,
  // updateUser,
  // deleteUser,
};
