import express from 'express';
import userService from '../services/userService';
import { toNewUserEntry } from '../utils/requestProcessor';
// import { IUser, UserModel } from '../models/user';

const userRouter = express.Router();

// Get all
// userRouter.get('/', async (_req, res) => {
//   const users = await userService.getUsers();
//   res.json(users);
// });

// Get one
userRouter.get('/:id', async (req, res) => {
  const user = await userService.getUser(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

// Create one
userRouter.post('/', async (req, res) => {
  const newUserEntry = toNewUserEntry(req.body);
  const addedUser = await userService.addUser(newUserEntry);
  res.status(201).json(addedUser);
});

// Update one
// userRouter.put('/:id', async (req, res) => {
//   const user = await userService.getUser(req.params.id);

//   if (user) {
//     const updatedUserEntry = toNewUserEntry(req.body);
//     const updatedUser = await userService.updateUser(
//       req.params.id,
//       updatedUserEntry,
//     );

//     res.status(201).json(updatedUser);
//   }
// });

// Delete one
// userRouter.delete('/:id', async (req, res) => {
//   await userService.deleteUser(req.params.id);
//   res.status(204).end();
// });

export default userRouter;
