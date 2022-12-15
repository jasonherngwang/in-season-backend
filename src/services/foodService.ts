import { NewFoodEntry } from '../types';
import { IFood, FoodModel } from '../models/food';

// Get all
const getFoods = async (): Promise<IFood[]> => {
  const foods = await FoodModel.find({});
  return foods;
};

// Get one
const getFood = async (id: string) => {
  const food = await FoodModel.findById(id);
  return food;
};

// Create one
const addFood = async (entry: NewFoodEntry) => {
  const newFood = new FoodModel({
    name: entry.name,
    category: entry.category,
    months: entry.months,
    description: entry.description,
    imageUrl: entry.imageUrl,
  });

  const addedFood = await newFood.save();
  return addedFood;
};

const linkFoodToUser = async (food: IFood, user: any) => {
  // eslint-disable-next-line no-param-reassign
  user.foods = user.foods.concat(food._id);
  await user.save();
};

// Update one
const updateFood = async (id: string, entry: NewFoodEntry) => {
  const updatedFood = FoodModel.findByIdAndUpdate(
    id,
    {
      name: entry.name,
      category: entry.category,
      months: entry.months,
      description: entry.description,
      imageUrl: entry.imageUrl,
    },
    { new: true, runValidators: true, context: 'query' },
  );

  return updatedFood;
};

// Delete one
const deleteFood = async (id: string): Promise<void> => {
  await FoodModel.findByIdAndDelete(id);
};

export default {
  getFoods,
  getFood,
  addFood,
  linkFoodToUser,
  updateFood,
  deleteFood,
};
