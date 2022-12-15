import express from 'express';
import basketService from '../services/basketService';
import { AuthenticationError } from '../utils/errors';

const basketRouter = express.Router();

const basketBelongsToUser = async (req: any, res: any): Promise<boolean> => {
  const { user } = req;

  if (!user) {
    throw new AuthenticationError('must be logged in to edit/delete basket');
  }

  const basket: any = await basketService.getBasket(req.params.id);
  if (!basket) {
    return res.status(404).end();
  }

  const isBasketOwner = basket.owner._id.toString() === user._id;

  if (!(basket && isBasketOwner)) {
    // Basket is not owned by user
    throw new AuthenticationError(
      "only the basket's creator can edit/delete it",
    );
  }

  return true;
};

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
  // const { user } = req;

  // Testing ------------------------------------
  const { user } = req.body;
  // Testing ------------------------------------

  if (!user) {
    throw new AuthenticationError('must be logged in to add basket');
  }

  const addedBasket = await basketService.addBasket(user._id);
  return res.status(201).json(addedBasket);
});

// Rename
basketRouter.patch('/:id', async (req: any, res) => {
  const authorized = await basketBelongsToUser(req, res);
  if (!authorized) {
    return res.status(404).end();
  }

  const { body } = req;
  let updatedBasket = await basketService.getBasket(req.params.id);

  // Determine the updates that need to be made
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
  const authorized = await basketBelongsToUser(req, res);
  if (!authorized) {
    return res.status(404).end();
  }

  await basketService.deleteBasket(req.params.id);
  return res.status(204).end();
});

export default basketRouter;
