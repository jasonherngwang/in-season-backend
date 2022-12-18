import { UserModel, IUser } from '../models/user';

const testUserCredentials = {
  username: 'initialUser',
  password: 'password',
};

const testUser = {
  username: 'initialUser',
  passwordHash: '$2b$10$gzmxMnllRga2WJxpq5HWFu1FVL/iyZO9QFpJhPdeIyMGgvGqesJQ2',
};

const coconut = {
  name: 'Coconut',
  category: 'fruit',
  description: 'a tasty tropical treat',
  months: {
    '0': true,
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true,
    '8': true,
    '9': true,
    '10': true,
    '11': true,
  },
  imageUrl: 'url',
};

const giantCoconut = {
  name: 'Giant Coconut',
  category: 'fruit',
  description: 'a large tasty tropical treat',
  months: {
    '0': true,
    '1': true,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
    '7': false,
    '8': false,
    '9': false,
    '10': true,
    '11': true,
  },
  imageUrl: 'url',
};

const usersInDb = async () => {
  const users = await UserModel.find({});
  return users.map((user) => user.toJSON());
};

const getUser = async (username: string) => {
  const user: IUser | null = await UserModel.findOne({
    username,
  });
  return user || null;
};

export default {
  testUser,
  testUserCredentials,
  coconut,
  giantCoconut,
  usersInDb,
  getUser,
};
