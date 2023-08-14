const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

function getCards(req, res) {
  Card.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: `На сервере произошла ошибка ${err.message}` }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля',
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function deleteCardById(req, res) {
  Card.findById(req.params.cardId) // Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Карточка или пользователь не найден',
        });
      }
      if (card.owner !== req.user._id) {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Нет прав на удаление карточки',
        });
      }
      Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => {
        if (!deletedCard) {
          return res.status(ERROR_NOT_FOUND).send({
            message: 'Карточка или пользователь не найден',
          });
        }
        return res.status(200).send({ data: deletedCard });
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля',
        });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Карточка или пользователь не найден',
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Карточка или пользователь не найден',
        });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_NOT_FOUND).send({
          message:
            'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля',
        });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Карточка или пользователь не найден',
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Карточка или пользователь не найден',
        });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message:
            'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля',
        });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({
          message: 'Карточка или пользователь не найден',
        });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
