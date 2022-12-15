import { FoodModel } from '../models/food';
import { UserModel } from '../models/user';
import { IBasketItem, BasketModel } from '../models/basket';

const getBasket = async (id: string) => {
  const basket = await BasketModel.findById(id).populate(['foods']);
  return basket;
};

// Created for the user upon account creation
const addBasket = async (userId: string) => {
  const newBasket = new BasketModel({
    foods: [],
  });

  const addedBasket = await newBasket.save();

  await UserModel.findByIdAndUpdate(userId, {
    basket: addedBasket._id,
  });

  return addedBasket;
};

// Update operations
const addFoodToBasket = async (basketId: string, foodId: string) => {
  const food: any = await FoodModel.findById(foodId);
  const basket: any = await BasketModel.findById(basketId);
  if (!food || !basket) return null;

  const foodToAdd = {
    food: food._id,
    acquired: false,
  };

  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      foods: basket.foods.some(
        (f: IBasketItem) => f.food.toString() === food._id.toString(),
      )
        ? basket.foods
        : basket.foods.concat(foodToAdd),
    },
    { new: true, runValidators: true, context: 'query' },
  );
  return updatedBasket;
};

const deleteFoodFromBasket = async (basketId: string, foodId: string) => {
  const food: any = await FoodModel.findById(foodId);
  const basket: any = await BasketModel.findById(basketId);
  if (!food || !basket) return null;

  console.log(basket);

  const updatedBasket = await BasketModel.findByIdAndUpdate(
    basketId,
    {
      foods: basket.foods.filter(
        (f: IBasketItem) => f.food.toString() !== food._id.toString(),
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
const deleteBasket = async (id: string) => {
  await BasketModel.findByIdAndDelete(id);
};

export default {
  getBasket,
  addBasket,
  addFoodToBasket,
  deleteFoodFromBasket,
  clearBasket,
  deleteBasket,
};
