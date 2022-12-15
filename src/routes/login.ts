import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { IUser, UserModel } from '../models/user';

import { AuthenticationError } from '../utils/errors';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user: IUser | null = await UserModel.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    throw new AuthenticationError('username or password incorrect');
  }

  const userData = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userData, process.env.SECRET as string, {
    expiresIn: '7d',
  });

  return res.status(200).send({
    token,
    username: user.username,
  });
});

export default loginRouter;
