import foods from '../../data/foods';
import { Food } from '../types';

const getFoods = (): Food[] => foods;

export default {
  getFoods,
};
