import { NewFoodEntry } from '../src/types';
import { FoodModel } from '../src/models/food';

const data: NewFoodEntry[] = require('./seedData.json');

const seedData = async () => {
  try {
    await FoodModel.deleteMany({});

    data.forEach((food) => {
      new FoodModel(food).save();
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
};

export default seedData;
