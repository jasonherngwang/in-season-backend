import foods from '../../data/foods';
import { Food } from '../types';

const getFoods = (): Food[] => foods;

const getFood = (id: string): Food | undefined =>
  foods.find((food) => food.id === id);

export default {
  getFoods,
  getFood,
};
