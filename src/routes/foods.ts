import express, { Request } from 'express';
import foodService from '../services/foodService';
import { toNewFoodEntry } from '../utils/validators';
import { AuthenticationError } from '../utils/errors';

const foodRouter = express.Router();

foodRouter.get('/:id', async (req: Request, res) => {
  const { user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to view food');
  }

  const food = await foodService.getFood(user._id.toString(), req.params.id);
  return res.status(201).json(food);
});

foodRouter.post('/', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to add food');
  }

  const newFoodEntry = toNewFoodEntry(body);
  const addedFood = await foodService.addFood(
    user._id.toString(),
    newFoodEntry,
  );
  return res.status(201).json(addedFood);
});

foodRouter.put('/:id', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to edit food');
  }

  const updatedFoodEntry = toNewFoodEntry(body);
  const updatedFood = await foodService.updateFood(
    user._id.toString(),
    req.params.id,
    updatedFoodEntry,
  );

  return res.status(201).json(updatedFood);
});

foodRouter.delete('/:id', async (req: Request, res) => {
  const { user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to delete food');
  }

  await foodService.deleteFood(user._id.toString(), req.params.id);
  return res.status(204).end();
});

export default foodRouter;
