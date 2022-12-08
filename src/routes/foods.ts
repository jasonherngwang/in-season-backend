import express from 'express';
import foodService from '../services/foodService';
import { AuthenticationError } from '../utils/errors';
import { toNewFoodEntry } from '../utils/requestProcessor';

const foodRouter = express.Router();

// Get all
foodRouter.get('/', async (_req, res) => {
  const foods = await foodService.getFoods();
  return res.json(foods);
});

// Get one
foodRouter.get('/:id', async (req, res) => {
  const food = await foodService.getFood(req.params.id);

  if (food) {
    return res.json(food);
  }
  return res.status(404).end();
});

// Create one
foodRouter.post('/', async (req: any, res) => {
  // Middleware queries user by id from db and inserts into request
  const { body, user } = req;

  if (!user) {
    throw new AuthenticationError('must be logged in to add food');
  }

  const newFoodEntry = toNewFoodEntry(body);
  const addedFood = await foodService.addFood(newFoodEntry);
  await foodService.linkFoodToUser(addedFood, user);
  return res.status(201).json(addedFood);
});

// Update one
foodRouter.put('/:id', async (req: any, res) => {
  const { body, user } = req;

  if (!user) {
    throw new AuthenticationError('must be logged in to edit food');
  }

  const food = await foodService.getFood(req.params.id);
  if (!food) {
    return res.status(404).end();
  }

  // Compare Mongoose ObjectIDs
  // eslint-disable-next-line no-underscore-dangle
  const isFoodOwner = user.foods.includes(food._id);

  if (food && isFoodOwner) {
    const updatedFoodEntry = toNewFoodEntry(body);
    const updatedFood = await foodService.updateFood(
      req.params.id,
      updatedFoodEntry,
    );

    return res.status(201).json(updatedFood);
  }
  // Food is not owned by user
  throw new AuthenticationError("only the food's creator can edit it");
});

// Delete one
foodRouter.delete('/:id', async (req, res) => {
  await foodService.deleteFood(req.params.id);
  return res.status(204).end();
});

export default foodRouter;
