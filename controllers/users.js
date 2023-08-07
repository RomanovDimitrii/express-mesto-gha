const User = require("../models/user");
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
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Произошла ошибка" })
    );
}

function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_NOT_FOUND).send({
          message: "Карточка или пользователь не найден",
        });
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            "Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля",
        });
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
}

function changeProfile(req, res) {
  const { name, about, avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about, avatar })
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
      res.status(500).send({ message: "Произошла ошибка" });
    });
}

function changeAvatar(req, res) {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar })
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
      res.status(500).send({ message: "Произошла ошибка" });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  changeProfile,
  changeAvatar,
};
