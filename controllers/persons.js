const personsRouter = require('express').Router();
const Person = require('../models/Person');
const User = require('../models/User');
const authJwt = require('../middlewares/authJwt');

personsRouter.get('/', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
      //mongoose.connection.close();
    })
    .catch((e) => next(e));
});

personsRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Person.findById(id)
    .then((person) => {
      res.json(person);
      //mongoose.connection.close();
    })
    .catch((e) => next(e));
});

personsRouter.delete('/:id', authJwt, (req, res, next) => {
  const { id } = req.params;
  Person.findByIdAndDelete(id)
    .then((person) => {
      res.status(204).end();
      //mongoose.connection.close();
    })
    .catch((e) => next(e));
});

personsRouter.post('/', authJwt, async (req, res, next) => {
  const person = req.body;

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'the name or number is missing',
    });
  }

  const user = await User.findById(req.userId);

  const newPerson = new Person({
    name: person.name,
    number: person.number,
    user: user._id,
  });

  newPerson
    .save()
    .then(async (savedPerson) => {
      user.people = user.people.concat(savedPerson);
      await user.save();
      res.json(savedPerson);
    })
    .catch((e) => next(e));
});

personsRouter.put('/:id', authJwt, (req, res, next) => {
  const person = req.body;
  const { id } = req.params;

  const newPersonInfo = {
    name: person.name,
    number: person.number,
  };

  Person.findByIdAndUpdate(id, newPersonInfo, { new: true })
    .then((person) => {
      res.json(person);
    })
    .catch((e) => next(e));
});

module.exports = personsRouter;
