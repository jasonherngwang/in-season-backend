import express from 'express';
import basketService from '../services/basketService';
import { AuthenticationError } from '../utils/errors';

const basketRouter = express.Router();

// Get all
basketRouter.get('/', async (_req, res) => {
  const baskets = await basketService.getBaskets();
  return res.json(baskets);
});

// Get one
basketRouter.get('/:id', async (req, res) => {
  const basket = await basketService.getBasket(req.params.id);

  if (basket) {
    return res.json(basket);
  }
  return res.status(404).end();
});

// Create one
basketRouter.post('/', async (req: any, res) => {
  const { user } = req;

  if (!user) {
    throw new AuthenticationError('must be logged in to add basket');
  }

  const addedBasket = await basketService.addBasket();
  const linkedBasket = await basketService.setUserAsBasketOwner(
    addedBasket._id.toString(),
    user._id,
  );
  return res.status(201).json(linkedBasket);
});

// Rename
basketRouter.patch('/:id', async (req: any, res) => {
  // const { body, user } = req;
  const { body } = req;

  // testing
  const user = {
    _id: '6391785d9409fac240c9ae0a',
  };

  if (!user) {
    throw new AuthenticationError('must be logged in to edit basket');
  }

  const basket: any = await basketService.getBasket(req.params.id);
  if (!basket) {
    return res.status(404).end();
  }

  const isBasketOwner = basket.owner.toString() === user._id;

  if (!(basket && isBasketOwner)) {
    // Basket is not owned by user
    throw new AuthenticationError("only the basket's creator can edit it");
  }

  // Determine the updates that need to be made
  let updatedBasket = basket;
  if (body.attributes.newName) {
    updatedBasket = await basketService.renameBasket(
      req.params.id,
      body.attributes.newName,
    );
  }
  if (body.attributes.foodToAdd) {
    updatedBasket = await basketService.addFoodToBasket(
      req.params.id,
      body.attributes.foodToAdd,
    );
  }
  if (body.attributes.foodToDelete) {
    updatedBasket = await basketService.deleteFoodFromBasket(
      req.params.id,
      body.attributes.foodToDelete,
    );
  }
  if (body.attributes.clearBasket) {
    updatedBasket = await basketService.clearBasket(req.params.id);
  }

  return res.status(201).json(updatedBasket);
});

// Delete one
basketRouter.delete('/:id', async (req, res) => {
  await basketService.deleteBasket(req.params.id);
  return res.status(204).end();
});

export default basketRouter;
