import { Types } from 'mongoose';
import { IBasketFood, UserModel } from '../models/user';
import userService from './userService';
import { ValidationError } from '../utils/errors';

const addFood = async (userId: string, foodId: string) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  const foodToAdd = user.foods.find((food) => food._id.toString() === foodId);
  if (!foodToAdd) {
    throw new ValidationError('food does not exist');
  }

  const foodInBasket = user.basket.find(
    (item) => item.food._id.toString() === foodId,
  );
  if (foodInBasket) {
    throw new ValidationError('food already in basket');
  }

  const foodWithId: IBasketFood = {
    food: foodToAdd,
    acquired: false,
    _id: new Types.ObjectId(),
  };
  user.basket.push(foodWithId);
  await user.save();
  return foodWithId;
};

const deleteFood = async (userId: string, foodId: string) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  await UserModel.findByIdAndUpdate(
    userId,
    {
      basket: user.basket.filter((item) => item.food._id.toString() !== foodId),
    },
    { new: true, runValidators: true, context: 'query' },
  );
};

const clear = async (userId: string) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  user.basket = [];
  await user.save();
};

// Update operations
const toggleAcquired = async (
  userId: string,
  foodId: string,
  acquired: boolean,
) => {
  const user = await userService.getUser(userId);
  if (!(user && user.foods)) {
    throw new ValidationError('user does not exist');
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      basket: user.basket.map((item) => {
        if (item.food._id.toString() === foodId) {
          return {
            food: item.food,
            acquired,
          };
        }
        return item;
      }),
    },
    { new: true, runValidators: true, context: 'query' },
  );

  if (updatedUser !== null) {
    return updatedUser.basket;
  }
  return null;
};

export default {
  addFood,
  deleteFood,
  clear,
  toggleAcquired,
};
