const supertest = require('supertest');
const User = require('../models/User');
const Person = require('../models/Person');
const { app, server } = require('../index');
const api = supertest(app);

const initialPersons = [
  {
    name: 'Lautaro',
    number: '2932578897',
  },
  {
    name: 'Alexis',
    number: '2932578897',
  },
  {
    name: 'Soledad',
    number: '2932578897',
  },
];

const initialUsers = [
  {
    username: 'alextoranzo3',
    name: 'Alexis Toranzo',
    passwordHash: 'alexispwrd',
  },
  {
    username: 'nattoranzo3',
    name: 'Natalia Toranzo',
    passwordHash: 'nataliapwrd',
  },
  {
    username: 'dantoranzo3',
    name: 'Daniel Toranzo',
    passwordHash: 'danielpwrd',
  },
];

const getUsers = async () => {
  const usersDB = await User.find({});
  return usersDB.map((user) => user.toJSON());
};

const getUser = async (id) => {
  const userDB = await User.findById(id);
  return userDB.toJSON();
};

/* const getPerson = async (id) => {
  const personDB = await Person.findById(id);
  return personDB.toJSON();
}; */

module.exports = { initialPersons, initialUsers, getUser, getUsers, api, server };
