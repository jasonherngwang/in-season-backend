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
    // eslint-disable-next-line no-underscore-dangle
    addedBasket._id.toString(),
    // eslint-disable-next-line no-underscore-dangle
    user._id,
  );
  console.log('linked basket:', linkedBasket);
  return res.status(201).json(linkedBasket);
});

// Update one
// basketRouter.put('/:id', async (req: any, res) => {
//   const { body, user } = req;

//   if (!user) {
//     throw new AuthenticationError('must be logged in to edit basket');
//   }

//   const basket = await basketService.getBasket(req.params.id);
//   if (!basket) {
//     return res.status(404).end();
//   }

//   // Compare Mongoose ObjectIDs
//   // eslint-disable-next-line no-underscore-dangle
//   const isBasketOwner = user.baskets.includes(basket._id);

//   if (basket && isBasketOwner) {
//     const updatedBasketEntry = toNewBasketEntry(body);
//     const updatedBasket = await basketService.updateBasket(
//       req.params.id,
//       updatedBasketEntry,
//     );

//     return res.status(201).json(updatedBasket);
//   }
//   // Basket is not owned by user
//   throw new AuthenticationError("only the basket's creator can edit it");
// });

// Delete one
// basketRouter.delete('/:id', async (req, res) => {
//   await basketService.deleteBasket(req.params.id);
//   return res.status(204).end();
// });

export default basketRouter;
