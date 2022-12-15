import express, { Request } from 'express';
import basketService from '../services/basketService';
import { AuthenticationError } from '../utils/errors';

const basketRouter = express.Router();

// Add food to basket
basketRouter.patch('/add', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to add food to basket');
  }

  const updatedBasket = await basketService.addFood(
    user._id.toString(),
    body.food,
  );

  return res.json(updatedBasket);
});

// Delete food from basket
basketRouter.patch('/delete', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError(
      'must be logged in to delete food from basket',
    );
  }

  await basketService.deleteFood(user._id.toString(), body.food);
  return res.status(204).end();
});

// Delete all foods from basket
basketRouter.patch('/clear', async (req: Request, res) => {
  const { user } = req;
  if (!user) {
    throw new AuthenticationError(
      'must be logged in to delete food from basket',
    );
  }

  await basketService.clear(user._id.toString());
  return res.status(204).end();
});

// Toggle food acquired state
basketRouter.patch('/toggle', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to edit basket');
  }

  const updatedBasket = await basketService.toggleAcquired(
    user._id.toString(),
    body.food,
    body.acquired,
  );

  return res.json(updatedBasket);
});

export default basketRouter;
