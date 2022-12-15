import fs from 'fs';
import { NewUserEntry, NewFoodEntry } from '../src/types';
import { IUser, UserModel } from '../src/models/user';
import userService from '../src/services/userService';

const adminCredentials: NewUserEntry = {
  username: 'admin',
  password: 'pass',
};

const setupDb = async () => {
  await UserModel.deleteMany({});

  const admin: IUser | null = await userService.addUser(adminCredentials);
  if (!admin) return;
};

export default setupDb;
