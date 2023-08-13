const bcrypt = require("bcrypt"); // импортируем bcrypt
//const jwt = require("jsonwebtoken");

//const JWT_SECRET = "secret-key";

const User = require("../models/user");
const { generateToken } = require("../utils/token");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require("../errors/errors");

function getUsers(req, res) {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) =>
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: `На сервере произошла ошибка ${err.message}` })
    );
}

function getUserById(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({
          message: "Карточка или пользователь не найден",
        });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            "Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля",
        });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Карточка или пользователь не найден",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "На сервере произошла ошибка" });
    });
}

function getUserProfile(req, res) {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({
          message: "Карточка или пользователь не найден",
        });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            "Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля",
        });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message: "Карточка или пользователь не найден",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "На сервере произошла ошибка" });
    });
}

function createUser(req, res) {
  const {
    name = "Жак-Ив Кусто",
    about = "Исследователь",
    avatar = "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    //  console.log(hash);
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
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res.status(ERROR_BAD_REQUEST).send({
            message:
              "Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля",
          });
        }
        return res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "На сервере произошла ошибка" });
      });
  });
}

function changeProfile(req, res) {
  const { name, about, avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { name, about, avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он не будет создан
    }
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            "Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля",
        });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_NOT_FOUND).send({
          message: "Карточка или пользователь не найден",
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "На сервере произошла ошибка" });
    });
}

function login(req, res) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res
        .cookie("jwt", token, {
          //     maxAge: 3600000,
          httpOnly: true,
        })
        .end(token);
    })
    .catch((err) => {
      // ошибка аутентификации
      res.status(401).send({ message: err.message });
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
