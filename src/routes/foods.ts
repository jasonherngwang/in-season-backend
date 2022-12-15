import express, { Request, Response } from 'express';
import foodService from '../services/foodService';
import { AuthenticationError } from '../utils/errors';
import { toNewFoodEntry } from '../utils/requestProcessor';

const foodRouter = express.Router();

const foodBelongsToUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    throw new AuthenticationError('must be logged in to modify food');
  }

  const food = await foodService.getFood(req.params.id);
  if (!food) {
    return res.status(404).end();
  }

  const isFoodOwner = user.foods
    .map((f) => f.toString())
    .includes(food._id.toString());

  if (!(food && isFoodOwner)) {
    // Food is not owned by user
    throw new AuthenticationError("only the food's creator can edit/delete it");
  }

  return true;
};

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

// Create one (logged-in users only)
foodRouter.post('/', async (req: Request, res) => {
  // Middleware queries user by id from db and inserts into request
  const { body, user } = req;
  console.log(user);

  if (!user) {
    throw new AuthenticationError('must be logged in to add food');
  }

  const newFoodEntry = toNewFoodEntry(body);
  const addedFood = await foodService.addFood(newFoodEntry);
  await foodService.linkFoodToUser(addedFood, user);
  return res.status(201).json(addedFood);
});

// Update one (logged-in users only, and only foods that belong to them)
foodRouter.put('/:id', async (req: Request, res) => {
  const authorized = await foodBelongsToUser(req, res);
  if (!authorized) {
    return res.status(404).end();
  }

  const updatedFoodEntry = toNewFoodEntry(req.body);
  const updatedFood = await foodService.updateFood(
    req.params.id,
    updatedFoodEntry,
  );

  return res.status(201).json(updatedFood);
});

// Delete one (logged-in users only, and only foods that belong to them)
foodRouter.delete('/:id', async (req: Request, res) => {
  const authorized = await foodBelongsToUser(req, res);
  if (!authorized) {
    return res.status(404).end();
  }

  await foodService.deleteFood(req.params.id);
  return res.status(204).end();
});

export default foodRouter;
