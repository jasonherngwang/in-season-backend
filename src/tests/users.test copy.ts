import app from '../app';
import request from 'supertest';
import { UserModel } from '../models/user';

// Helper functions
const usersInDb = async () => {
  const users = await UserModel.find({});
  return users.map((user) => user.toJSON());
};

// Tests
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    // Clear db
    await UserModel.deleteMany({});

    // Seed user
    const user = new UserModel({
      username: 'initialUser',
      passwordHash: 'password',
    });
    await user.save();
  });

  test('creation succeeds with 201 with a new username', async () => {
    const usersAtStart = await usersInDb();

    const anotherUser = {
      username: 'anotherUser',
      password: 'password',
    };

    // const queriedUser = await UserModel.find({ username: 'jason' });

    await request(app)
      .post('/api/users')
      .send(anotherUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(anotherUser.username);
  });

  test('creation fails with 400 if username taken', async () => {
    const usersAtStart = await usersInDb();

    const anotherUser = {
      username: usersAtStart[0].username,
      password: 'password',
    };

    const result = await request(app)
      .post('/api/users')
      .send(anotherUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    console.log(result);
    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});
