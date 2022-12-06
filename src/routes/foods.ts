import express from 'express';
import foodService from '../services/foodService';
import Food from '../models/food';

const foodRouter = express.Router();

foodRouter.get('/', async (_req, res) => {
  const foods = await Food.find({});
  console.log('mongoose responded');
  res.json(foods);
});

foodRouter.get('/:id', (req, res) => {
  res.send(foodService.getFood(req.params.id));
});

export default foodRouter;
