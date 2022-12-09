import express from 'express';
import userService from '../services/userService';
import { toNewUserEntry } from '../utils/requestProcessor';
import { AuthenticationError } from '../utils/errors';

const userRouter = express.Router();

// Get all
userRouter.get('/', async (_req, res) => {
  const users = await userService.getUsers();
  return res.json(users);
});

// Get one
userRouter.get('/:id', async (req, res) => {
  const user = await userService.getUser(req.params.id);

  if (user) {
    return res.json(user);
  }
  return res.status(404).end();
});

// Create one
userRouter.post('/', async (req, res) => {
  const newUserEntry = toNewUserEntry(req.body);
  const addedUser = await userService.addUser(newUserEntry);
  return res.status(201).json(addedUser);
});

// Delete one
userRouter.delete('/:id', async (req: any, res) => {
  const { user } = req;
  const existingUser = await userService.getUser(req.params.id);

  if (!user || !existingUser) {
    throw new AuthenticationError('must be logged in to delete oneself');
  }

  await userService.deleteUser(req.params.id);
  return res.status(204).end();
});

export default userRouter;
