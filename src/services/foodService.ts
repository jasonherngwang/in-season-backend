// import foods from '../../data/foods';
import mongoose from 'mongoose';
import { NewFoodEntry } from '../types';
import { IFood, FoodModel } from '../models/food';

// Get all
const getFoods = async (): Promise<IFood[]> => {
  const foods = await FoodModel.find({});
  return foods;
};

// Get one
const getFood = async (id: string): Promise<IFood | null | undefined> => {
  // Check if in the ObjectId format expected by Mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('That food id does not exist.');
  }
  const food = await FoodModel.findById(id);
  return food;
};

// Create one
const addFood = async (entry: NewFoodEntry): Promise<IFood> => {
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

// Update one
const updateFood = async (
  id: string,
  entry: NewFoodEntry
): Promise<IFood | null | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('That food id does not exist.');
  }

  const updatedFood = FoodModel.findByIdAndUpdate(
    id,
    {
      name: entry.name,
      category: entry.category,
      months: entry.months,
      description: entry.description,
      imageUrl: entry.imageUrl,
    },
    { new: true, runValidators: true, context: 'query' }
  );

  return updatedFood;
};

// Delete one
const deleteFood = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('That food id does not exist.');
  }
  await FoodModel.findByIdAndDelete(id);
};

export default {
  getFoods,
  getFood,
  addFood,
  updateFood,
  deleteFood,
};
