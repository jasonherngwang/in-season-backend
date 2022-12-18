import mongoose from 'mongoose';
import app from '../app';
import request from 'supertest';
import { UserModel, IUser } from '../models/user';
import helper from './helper';

// Tests
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
    const user = new UserModel(helper.testUser);
    await user.save();
  });

  test('can get user data', async () => {
    const user: IUser | null = await UserModel.findOne({
      username: helper.testUserCredentials.username,
    });
    if (user) {
      expect(user.username).toBe(helper.testUserCredentials.username);
    }
  });

  test('creation succeeds with 201 with a new username', async () => {
    const usersAtStart = await helper.usersInDb();

    const anotherUser = {
      username: 'anotherUser',
      password: 'password',
    };

    await request(app)
      .post('/api/users')
      .send(anotherUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(anotherUser.username);
  });

  test('creation fails with 400 if username taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const anotherUser = {
      username: usersAtStart[0].username,
      password: 'password',
    };

    const response = await request(app)
      .post('/api/users')
      .send(anotherUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

// Login
describe('login', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
    const user = new UserModel(helper.testUser);
    await user.save();
  });

  test('user can login and receive a token', async () => {
    const response = await request(app)
      .post('/api/login')
      .send(helper.testUserCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.username).toBe(helper.testUserCredentials.username);
    expect(response.body.token).toBeDefined(); // A token is returned
  });

  test('login fails with invalid credentials', async () => {
    const credentials = {
      username: 'initialUser',
      password: 'incorrectPassword',
    };

    const response = await request(app)
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('username or password incorrect');
  });
});

// Delete user
describe('delete', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
    const user = new UserModel(helper.testUser);
    await user.save();
  });

  test('user can delete their own account', async () => {
    const usersAtStart = await helper.usersInDb();
    expect(usersAtStart.length).toBe(1);

    const loginResponse = await request(app)
      .post('/api/login')
      .send(helper.testUserCredentials);

    await request(app)
      .delete('/api/users')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .expect(204);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
