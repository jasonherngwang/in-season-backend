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
  try {
    const food = await foodService.getFood(req.params.id);

    if (food) {
      res.json(food);
    } else {
      res.status(404).end();
    }
  } catch (error: unknown) {
    let errorMessage = 'There was an error when adding the food.';
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    res.status(400).send(errorMessage);
  }
});

// Create one
foodRouter.post('/', async (req, res) => {
  try {
    const newFoodEntry = toNewFoodEntry(req.body);
    const addedFood = await foodService.addFood(newFoodEntry);
    res.status(201).json(addedFood);
  } catch (error: unknown) {
    let errorMessage = 'There was an error when adding the food.';
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    res.status(400).send(errorMessage);
  }
});

// Update one
foodRouter.put('/:id', async (req, res) => {
  try {
    const food = await foodService.getFood(req.params.id);

    if (food) {
      const updatedFoodEntry = toNewFoodEntry(req.body);
      const updatedFood = await foodService.updateFood(
        req.params.id,
        updatedFoodEntry
      );

      res.status(201).json(updatedFood);
    }
  } catch (error: unknown) {
    let errorMessage = 'There was an error when updating the food.';
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    res.status(400).send(errorMessage);
  }
});

// Delete one
foodRouter.delete('/:id', async (req, res) => {
  try {
    await foodService.deleteFood(req.params.id);
    res.status(204).end();
  } catch (error: unknown) {
    let errorMessage = 'There was an error when deleting the food.';
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    res.status(400).send(errorMessage);
  }
});

export default foodRouter;
