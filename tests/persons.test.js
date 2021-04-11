const mongoose = require('mongoose');
const Person = require('../models/Person');
const { initialPersons, api, server, getUser, getUsers } = require('./helpers');

beforeEach(async () => {
  await Person.deleteMany({});

  for (const person of initialPersons) {
    const personObject = new Person(person);
    await personObject.save();
  }
});

describe('testing persons api', () => {
  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two persons', async () => {
    const response = await api.get('/api/persons');
    expect(response.body).toHaveLength(initialPersons.length);
  });

  test('get a person', async () => {
    const response = await api.get('/api/persons');
    const firstPersonId = response.body[0].id;
    const firstPerson = await api.get(`/api/persons/${firstPersonId}`);
    expect(firstPerson.body.id).toBe(firstPersonId);
    expect(firstPerson.body.name).toBe(initialPersons[0].name);
    expect(firstPerson.body.number).toBe(initialPersons[0].number);
  });

  test('delete a person', async () => {
    const response = await api.get('/api/persons');
    const firstPersonId = response.body[0].id;
    await api.delete(`/api/persons/${firstPersonId}`).expect(204);
    const response2 = await api.get('/api/persons');
    expect(response.body).toHaveLength(initialPersons.length);
    expect(response2.body).toHaveLength(initialPersons.length - 1);
  });

  test('post a person', async () => {
    const users = await getUsers();

    const newPerson = {
      name: 'Oriana',
      number: '2932578897',
      userId: users[0].id,
    };

    const response = await api
      .post('/api/persons')
      .send(newPerson)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const user = await getUser(newPerson.userId);
    expect(response.body.name).toBe(newPerson.name);
    expect(response.body.number).toBe(newPerson.number);
    expect(user.people).toContain(response.body.id);
  });

  test('put a person', async () => {
    const updatePerson = {
      name: 'Oriana',
      number: '2932578897',
    };

    const response = await api.get('/api/persons');
    const firstPersonId = response.body[0].id;

    const response2 = await api
      .put(`/api/persons/${firstPersonId}`)
      .send(updatePerson)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.id).toBe(firstPersonId);
    expect(response2.body.name).toBe(updatePerson.name);
    expect(response2.body.number).toBe(updatePerson.number);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
