import mongoose from 'mongoose';
import app from '../app';
import request from 'supertest';
import { UserModel } from '../models/user';
import helper from './helper';

describe('when the user has no foods', () => {
  let bearerToken = '';

  beforeEach(async () => {
    await UserModel.deleteMany({});
    const user = new UserModel(helper.testUser);
    await user.save();

    const response = await request(app)
      .post('/api/login')
      .send(helper.testUserCredentials);

    bearerToken = 'Bearer ' + response.body.token;
  });

  test('user can add a food', async () => {
    const userAtStart = await helper.getUser(
      helper.testUserCredentials.username,
    );

    const response = await request(app)
      .post('/api/foods')
      .set('Authorization', bearerToken)
      .send(helper.coconut)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe(helper.coconut.name);

    const userAtEnd = await helper.getUser(helper.testUserCredentials.username);

    if (userAtEnd && userAtEnd.foods && userAtStart && userAtStart.foods) {
      expect(userAtEnd.foods).toHaveLength(userAtStart.foods.length + 1);
    }
  });

  // When logged out
  test('logged-out user cannot add a food', async () => {
    const response = await request(app)
      .post('/api/foods')
      .send(helper.coconut)
      .expect(401);
    expect(response.body.error).toContain('must be logged in');
  });
});

describe('when the user has some foods', () => {
  let bearerToken = '';
  let foodId = '';

  beforeEach(async () => {
    await UserModel.deleteMany({});
    const user = new UserModel(helper.testUser);
    await user.save();

    const loginResponse = await request(app)
      .post('/api/login')
      .send(helper.testUserCredentials);

    bearerToken = 'Bearer ' + loginResponse.body.token;

    const response = await request(app)
      .post('/api/foods')
      .set('Authorization', bearerToken)
      .send(helper.coconut);

    foodId = response.body._id;
  });

  test('user can retrieve a food by id', async () => {
    const food = await request(app)
      .get(`/api/foods/${foodId}`)
      .set('Authorization', bearerToken);

    expect(food.body.name).toBe(helper.coconut.name);
  });

  test('user can edit a food', async () => {
    const response = await request(app)
      .put(`/api/foods/${foodId}`)
      .set('Authorization', bearerToken)
      .send(helper.giantCoconut)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe(helper.giantCoconut.name);
  });

  test('user can delete a food', async () => {
    await request(app)
      .delete(`/api/foods/${foodId}`)
      .set('Authorization', bearerToken)
      .expect(204);

    const user = await helper.getUser(helper.testUserCredentials.username);

    if (user && user.foods) {
      expect(user.foods).toHaveLength(0);
    }
  });

  // When logged out
  test('logged-out user cannot retrieve a food', async () => {
    const response = await request(app).get(`/api/foods/${foodId}`).expect(401);
    expect(response.body.error).toContain('must be logged in');
  });

  test('logged-out user cannot edit a food', async () => {
    const response = await request(app)
      .put(`/api/foods/${foodId}`)
      .send(helper.giantCoconut)
      .expect(401);
    expect(response.body.error).toContain('must be logged in');
  });

  test('logged-out user cannot delete a food', async () => {
    const response = await request(app)
      .delete(`/api/foods/${foodId}`)
      .expect(401);
    expect(response.body.error).toContain('must be logged in');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
