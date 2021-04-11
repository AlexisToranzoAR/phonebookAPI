/* eslint-disable no-shadow */
require('./mongo');
const express = require('express');
const app = express();
const cors = require('cors');
const usersRouter = require('./controllers/users');
const personsRouter = require('./controllers/persons');

const notFound = require('./middlewares/notFound');
const handleErrors = require('./middlewares/handleErrors');

const loginRouter = require('./controllers/login');

app.use(cors());
app.use(express.json());

app.use('/api/login', loginRouter);
app.use('/api/persons', personsRouter);
app.use('/api/users', usersRouter);

app.use(notFound);
app.use(handleErrors);

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
