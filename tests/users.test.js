const mongoose = require('mongoose');
const User = require('../models/User');
const { initialUsers, getUsers, api, server } = require('./helpers');

beforeEach(async () => {
  await User.deleteMany({});

  for (const user of initialUsers) {
    const userObject = new User(user);
    await userObject.save();
  }
});

describe('testing users api', () => {
  test('work as expected creting a fresh user', async () => {
    const newUser = {
      username: 'lautoranzo3',
      name: 'Lautaro Toranzo',
      password: 'lautaropwrd',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const users = await getUsers();

    expect(users).toHaveLength(initialUsers.length + 1);

    const usernames = users.map((user) => user.username);

    expect(usernames).toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
