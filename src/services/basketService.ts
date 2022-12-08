import mongoose from 'mongoose';
import { FoodModel } from '../models/food';
import { UserModel } from '../models/user';
import { IBasket, BasketModel } from '../models/basket';

// Get all baskets for user
const getBaskets = async (userId: string = ''): Promise<IBasket[]> => {
  const baskets = await BasketModel.find(
    userId
      ? {
          _id: new mongoose.Types.ObjectId(userId),
        }
      : {},
  );
  return baskets;
};

// Get one basket by id
const getBasket = async (id: string): Promise<IBasket | null | undefined> => {
  const basket = await BasketModel.findById(id);
  return basket;
};

// Create one basket
const addBasket = async (): Promise<IBasket> => {
  const newBasket = new BasketModel({
    name: 'My Basket',
  });

  const addedBasket = await newBasket.save();
  return addedBasket;
};

// basket, user, and food are sent from frontend; they have string id, not _id
const setUserAsBasketOwner = async (
  basketId: string,
  userId: string,
): Promise<IBasket | null | undefined> => {
  const user: any = await UserModel.findById(userId);
  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      // eslint-disable-next-line no-underscore-dangle
      owner: user._id,
    },
    { new: true, runValidators: true, context: 'query' },
  );
  return updatedBasket;
};

// Update operations
const renameBasket = async (
  id: string,
  newName: string,
): Promise<IBasket | null | undefined> => {
  const updatedBasket = BasketModel.findByIdAndUpdate(
    id,
    {
      name: newName,
    },
    { new: true, runValidators: true, context: 'query' },
  );

  return updatedBasket;
};

const addFoodToBasket = async (
  basketId: string,
  foodId: string,
): Promise<IBasket | null | undefined> => {
  const food: any = FoodModel.findById(foodId);
  const basket: any = await BasketModel.findById(basketId);
  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      // eslint-disable-next-line no-underscore-dangle
      foods: basket.foods.concat(food._id),
    },
    { new: true, runValidators: true, context: 'query' },
  );
  return updatedBasket;
};

const deleteFoodFromBasket = async (
  basketId: string,
  foodId: string,
): Promise<IBasket | null | undefined> => {
  const food: any = FoodModel.findById(foodId);
  const basket: any = await BasketModel.findById(basketId);
  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      foods: basket.foods.filter((f: any) => f._id !== food._id),
    },
    { new: true, runValidators: true, context: 'query' },
  );
  return updatedBasket;
};

// Delete all foods from basket
const clearBasket = async (basketId: string) => {
  await BasketModel.findByIdAndUpdate(
    basketId,
    {
      foods: [],
    },
    { new: true, runValidators: true, context: 'query' },
  );
};

// Delete basket
const deleteBasket = async (id: string): Promise<void> => {
  await BasketModel.findByIdAndDelete(id);
};

export default {
  getBaskets,
  getBasket,
  addBasket,
  setUserAsBasketOwner,
  addFoodToBasket,
  deleteFoodFromBasket,
  clearBasket,
  renameBasket,
  deleteBasket,
};
