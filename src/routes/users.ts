import express, { Request } from 'express';
import userService from '../services/userService';
import { toNewUserEntry } from '../utils/requestProcessor';
import { AuthenticationError } from '../utils/errors';

const userRouter = express.Router();

// Request type has been extended with `user` property
// Middleware has validated the JWT token; no additional auth needed here
userRouter.get('/', async (req: Request, res) => {
  const { user } = req;
  if (!user) {
    return res.status(404).end();
  }

  const existingUser = await userService.getUser(user._id.toString());
  return res.json(existingUser);
});

userRouter.post('/', async (req, res) => {
  // Validate username and password input format; ValidationError may be thrown
  const newUserEntry = toNewUserEntry(req.body);
  const addedUser = await userService.addUser(newUserEntry);
  return res.status(201).json(addedUser);
});

userRouter.delete('/', async (req: Request, res) => {
  const { user } = req;
  if (!user) {
    throw new AuthenticationError('only the user can delete themself');
  }

  await userService.deleteUser(user._id.toString());
  return res.status(204).end();
});

export default userRouter;
