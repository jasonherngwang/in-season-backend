import express from 'express';
import foodService from '../services/foodService';
import toNewFoodEntry from '../utils/requestProcessor';

const foodRouter = express.Router();

// Get all
foodRouter.get('/', async (_req, res) => {
  const foods = await foodService.getFoods();
  res.json(foods);
});

// Get one
foodRouter.get('/:id', async (req, res) => {
  const food = await foodService.getFood(req.params.id);

  if (food) {
    res.json(food);
  } else {
    res.status(404).end();
  }
});

// Create one
foodRouter.post('/', async (req, res) => {
  const newFoodEntry = toNewFoodEntry(req.body);
  const addedFood = await foodService.addFood(newFoodEntry);
  res.status(201).json(addedFood);
});

// Update one
foodRouter.put('/:id', async (req, res) => {
  const food = await foodService.getFood(req.params.id);

  if (food) {
    const updatedFoodEntry = toNewFoodEntry(req.body);
    const updatedFood = await foodService.updateFood(
      req.params.id,
      updatedFoodEntry
    );

    res.status(201).json(updatedFood);
  }
});

// Delete one
foodRouter.delete('/:id', async (req, res) => {
  await foodService.deleteFood(req.params.id);
  res.status(204).end();
});

export default foodRouter;
