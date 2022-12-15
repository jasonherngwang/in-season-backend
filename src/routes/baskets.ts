import express, { Request } from 'express';
import basketService from '../services/basketService';
import { AuthenticationError } from '../utils/errors';

const basketRouter = express.Router();

// Toggle food acquired state
basketRouter.patch('/:id/acquire', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to edit basket');
  }

  let updatedBasket = await basketService.getBasket(req.params.id);

  updatedBasket = await basketService.toggleFoodAcquired(
    req.params.id,
    body.foodToToggle,
    body.acquired,
  );

  if (updatedBasket) {
    return res.status(200).json(updatedBasket);
  }
  return res.status(400).end();
});

// Add food to basket
basketRouter.patch('/:id/add', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError('must be logged in to add food to basket');
  }

  let updatedBasket = await basketService.getBasket(req.params.id);

  updatedBasket = await basketService.addFoodToBasket(
    req.params.id,
    body.foodToAdd,
  );

  if (updatedBasket) {
    return res.status(200).json(updatedBasket);
  }
  return res.status(400).end();
});

// Delete food from basket
basketRouter.patch('/:id/delete', async (req: Request, res) => {
  const { body, user } = req;
  if (!user) {
    throw new AuthenticationError(
      'must be logged in to delete food from basket',
    );
  }

  let updatedBasket = await basketService.getBasket(req.params.id);

  updatedBasket = await basketService.deleteFoodFromBasket(
    req.params.id,
    body.foodToDelete,
  );

  if (updatedBasket) {
    return res.status(200).json(updatedBasket);
  }
  return res.status(400).end();
});

// Delete all foods from basket
basketRouter.patch('/:id/clear', async (req: Request, res) => {
  await basketService.clearBasket(req.params.id);

  return res.status(204).end();
});

export default basketRouter;
