const bcrypt = require('bcrypt'); // импортируем bcrypt
// const jwt = require("jsonwebtoken");

// const JWT_SECRET = "secret-key";

const User = require('../models/user');
const { generateToken } = require('../utils/token');
const { AuthError } = require('../errors/AuthError');
const { NotFoundError } = require('../errors/NotFoundError');

function getUsers(req, res, next) {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
}

function getUserById(req, res, next) {
  console.log(req);
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Карточка или пользователь не найден');
      }

      return res.status(200).send({ data: user });
    })
    .catch(next);
}

function getUserProfile(req, res, next) {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Карточка или пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(201).send({
          name,
          about,
          avatar,
          email,
          //    password: hash,
          _id: user._id,
        });
      })
      .catch(next);
  });
}

function changeProfile(req, res, next) {
  const { name, about, avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { name, about, avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он не будет создан
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res
        .cookie('jwt', token, {
          //     maxAge: 3600000,
          httpOnly: true,
        })
        .send({ message: 'Пользователь авторизован' });

      // .end({ message: "Пользователь авторизован" });
    })
    .catch((err) => {
      next(new AuthError(`Ошибка email или пароля ${err}`));
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeProfile,
  login,
  getUserProfile,
};
