const Card = require("../models/card");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require("../errors/errors");

function getCards(req, res) {
  Card.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) =>
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Произошла ошибка" })
    );
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log(req.user);

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            "Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля",
        });
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Произошла ошибка" });
    });
}

function deleteCardById(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((Card) => res.status(200).send({ data: Card }))
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

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((Card) => res.status(200).send({ data: Card }))
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

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((Card) => res.status(200).send({ data: Card }))
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
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
