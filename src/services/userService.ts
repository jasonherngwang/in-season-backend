import bcrypt from 'bcrypt';
import fs from 'fs';
import { Types } from 'mongoose';
import basketService from './basketService';
import { ValidationError } from '../utils/errors';
import { NewUserEntry, NewFoodEntry } from '../types';
import { IUser, UserModel } from '../models/user';
import { FoodModel } from '../models/food';

const getUsers = async () => {
  const users = await UserModel.find({});
  return users;
};

const getUser = async (id: string) => {
  const user = await UserModel.findById(id).populate(['foods', 'basket']);
  return user;
};

// Each new user gets their own copy of all foods
const initializeUserFoods = async (userId: string) => {
  const data: NewFoodEntry[] = JSON.parse(
    fs.readFileSync(`${__dirname}/../../data/seedData.json`, 'utf-8'),
  );

  const allFoods: Types.ObjectId[] = [];

  await Promise.all(
    data.map(async (food) => {
      const savedFood = await new FoodModel(food).save();
      allFoods.push(savedFood._id);
    }),
  );

  await UserModel.findByIdAndUpdate(
    userId,
    {
      foods: allFoods,
    },
    { new: true, runValidators: true, context: 'query' },
  );
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

  let addedUser: IUser | null = await newUser.save();
  // Iniitalize empty basket for user
  await basketService.addBasket(addedUser._id.toString());
  // Add copy of all "seed" foods to user
  await initializeUserFoods(addedUser._id.toString());
  // Get updated state of user
  addedUser = await UserModel.findById(addedUser._id.toString());

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
