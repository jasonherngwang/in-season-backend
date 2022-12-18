import mongoose from 'mongoose';
import app from '../app';
import request from 'supertest';
import { UserModel } from '../models/user';
import helper from './helper';

describe('when interacting with their basket', () => {
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

  test('user can add a food to their basket', async () => {
    const userAtStart = await helper.getUser(
      helper.testUserCredentials.username,
    );

    const response = await request(app)
      .patch('/api/basket/add')
      .set('Authorization', bearerToken)
      .send({ food: foodId })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].food.name).toBe(helper.coconut.name);
    expect(response.body[0].acquired).toBe(false);

    const userAtEnd = await helper.getUser(helper.testUserCredentials.username);

    if (userAtEnd && userAtEnd.basket && userAtStart && userAtStart.basket) {
      expect(userAtEnd.basket).toHaveLength(userAtStart.basket.length + 1);
    }
  });

  test('user can delete a food from their basket', async () => {
    await request(app)
      .patch('/api/basket/add')
      .set('Authorization', bearerToken)
      .send({ food: foodId });

    await request(app)
      .patch('/api/basket/delete')
      .set('Authorization', bearerToken)
      .send({ food: foodId })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const user = await helper.getUser(helper.testUserCredentials.username);

    if (user && user.basket) {
      expect(user.basket).toHaveLength(0);
    }
  });

  test('user can clear all foods from their basket', async () => {
    await request(app)
      .patch('/api/basket/add')
      .set('Authorization', bearerToken)
      .send({ food: foodId });

    await request(app)
      .patch('/api/basket/clear')
      .set('Authorization', bearerToken)
      .expect(204);

    const user = await helper.getUser(helper.testUserCredentials.username);

    if (user && user.basket) {
      expect(user.basket).toHaveLength(0);
    }
  });

  test('user can toggle the acquired state of a food in their basket', async () => {
    const initialBasket = await request(app)
      .patch('/api/basket/add')
      .set('Authorization', bearerToken)
      .send({ food: foodId });

    expect(initialBasket.body[0].acquired).toBe(false);

    const response = await request(app)
      .patch('/api/basket/toggle')
      .set('Authorization', bearerToken)
      .send({ basketFood: initialBasket.body[0].id, acquired: true });

    expect(response.body[0].acquired).toBe(true);
  });

  // When logged out
  test('logged-out user cannot add a food to their basket', async () => {
    const response = await request(app)
      .post('/api/foods')
      .send(helper.coconut)
      .expect(401);
    expect(response.body.error).toContain('must be logged in');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
