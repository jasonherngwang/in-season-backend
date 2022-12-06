import { Food, Category } from '../src/types';

const foods: Food[] = [
  {
    id: '1',
    name: 'Orange',
    description: 'Orange fruit',
    category: Category.Fruit,
    months: [0, 1, 2, 3, 4, 5],
    imageUrl: '../images/orange.png',
  },
  {
    id: '2',
    name: 'Watermelon',
    description: 'Watermelon fruit',
    category: Category.Fruit,
    months: [0, 1, 2, 3, 4, 5],
    imageUrl: '../images/watermelon.png',
  },
  {
    id: '3',
    name: 'Cabbage',
    description: 'Cabbage vegetable',
    category: Category.Vegetable,
    months: [0, 1, 2, 3, 4, 5],
    imageUrl: '../images/cabbage.png',
  },
];

export default foods;
