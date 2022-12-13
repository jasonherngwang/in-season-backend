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
  const basket = await BasketModel.findById(id).populate(['foods', 'owner']);
  return basket;
};

// Create one basket
const addBasket = async (userId: string): Promise<IBasket> => {
  const newBasket = new BasketModel({
    name: 'My Basket',
    owner: userId,
  });

  const user: any = await UserModel.findById(userId);
  await UserModel.findByIdAndUpdate(userId, {
    baskets: user.baskets.concat(newBasket._id),
  });

  const addedBasket = await newBasket.save();
  return addedBasket;
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
  const food: any = await FoodModel.findById(foodId);
  const basket: any = await BasketModel.findById(basketId);
  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      foods: basket.foods.includes(food._id)
        ? basket.foods
        : basket.foods.concat(food._id),
    },
    { new: true, runValidators: true, context: 'query' },
  );
  return updatedBasket;
};

const deleteFoodFromBasket = async (
  basketId: string,
  foodId: string,
): Promise<IBasket | null | undefined> => {
  const food: any = await FoodModel.findById(foodId);
  const basket: any = await BasketModel.findById(basketId);
  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      foods: basket.foods.filter(
        (f: mongoose.Types.ObjectId) => f.toString() === food._id,
      ),
    },
    { new: true, runValidators: true, context: 'query' },
  );
  return updatedBasket;
};

// Delete all foods from basket
const clearBasket = async (basketId: string) => {
  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      foods: [],
    },
    { new: true, runValidators: true, context: 'query' },
  );
  return updatedBasket;
};

// Delete basket
const deleteBasket = async (id: string): Promise<void> => {
  await BasketModel.findByIdAndDelete(id);
};

export default {
  getBaskets,
  getBasket,
  addBasket,
  addFoodToBasket,
  deleteFoodFromBasket,
  clearBasket,
  renameBasket,
  deleteBasket,
};
