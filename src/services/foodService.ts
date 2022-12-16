import { Types } from 'mongoose';
import { NewFoodEntry } from '../types';
import { IFood, UserModel } from '../models/user';
import userService from './userService';
import { ValidationError } from '../utils/errors';

const getFood = async (userId: string, foodId: string) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  const existingFood = user.foods.find(
    (food) => food._id.toString() === foodId,
  );
  if (existingFood) {
    return existingFood;
  }
  throw new ValidationError('food does not exists');
};

// Create one; no duplicates (name + category) allowed
const addFood = async (userId: string, newFood: NewFoodEntry) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  const existingFood = user.foods.find(
    (food) => food.name === newFood.name && food.category === newFood.category,
  );
  if (existingFood) {
    throw new ValidationError('food already exists');
  }

  const foodWithId: IFood = {
    ...newFood,
    _id: new Types.ObjectId(),
  };
  user.foods.push(foodWithId);
  await user.save();
  return foodWithId;
};

// Update one in both user account and basket
const updateFood = async (
  userId: string,
  foodId: string,
  newData: NewFoodEntry,
) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      foods: user.foods.map((food) => {
        if (food._id.toString() === foodId) {
          return {
            ...newData,
            _id: food._id,
          };
        }
        return food;
      }),
      basket: user.basket.map((item) => {
        if (item.food._id.toString() === foodId) {
          return {
            food: {
              ...newData,
              _id: item.food._id,
            },
            _id: item._id,
          };
        }
        return item;
      }),
    },
    { new: true, runValidators: true, context: 'query' },
  );

  if (!(updatedUser && updatedUser.foods)) {
    throw new ValidationError('user was not updated');
  }
  return updatedUser.foods.find((food) => food._id.toString() === foodId);
};

// Delete food from both user's food list and their basket
const deleteFood = async (userId: string, foodId: string) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  await UserModel.findByIdAndUpdate(
    userId,
    {
      foods: user.foods.filter((food) => food._id.toString() !== foodId),
      basket: user.basket.filter((item) => item.food._id.toString() !== foodId),
    },
    { new: true, runValidators: true, context: 'query' },
  );
};

export default {
  getFood,
  addFood,
  updateFood,
  deleteFood,
};
