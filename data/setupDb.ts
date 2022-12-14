import { Types } from 'mongoose';
import { NewUserEntry, NewFoodEntry } from '../src/types';
import { FoodModel } from '../src/models/food';
import { IUser, UserModel } from '../src/models/user';
import userService from '../src/services/userService';

const data: NewFoodEntry[] = require('./seedData.json');

const adminCredentials: NewUserEntry = {
  username: 'admin',
  password: 'pass',
};

const setupDb = async () => {
  try {
    // Clear db
    await FoodModel.deleteMany({});
    await UserModel.deleteMany({});

    // Create admin
    const admin: IUser = await userService.addUser(adminCredentials);

    // Link admin to all foods, so they can edit all
    const allFoods: Types.ObjectId[] = [];

    await Promise.all(
      data.map(async (food) => {
        const savedFood = await new FoodModel(food).save();
        allFoods.push(savedFood._id);
      }),
    );

    const updatedAdmin = await UserModel.findByIdAndUpdate(
      admin._id,
      {
        foods: allFoods,
      },
      { new: true, runValidators: true, context: 'query' },
    );
    console.log(updatedAdmin);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
};

export default setupDb;
