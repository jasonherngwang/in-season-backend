// Used for Cypress E2E testing located in frontend repo
import express, { Response } from 'express';
import { UserModel } from '../models/user';
import userService from '../services/userService';

const testingRouter = express.Router();

testingRouter.post('/reset', async (_req, res: Response) => {
  await UserModel.deleteMany({});
  return res.status(204).end();
});

testingRouter.post('/createTestUser', async (_req, res: Response) => {
  await userService.addUser({
    username: 'initialUser',
    password: 'password',
  });
  return res.status(204).end();
});

testingRouter.post('/createTrialUser', async (_req, res: Response) => {
  await userService.addUser({
    username: 'trial',
    password: 'password',
  });
  return res.status(204).end();
});

export default testingRouter;
