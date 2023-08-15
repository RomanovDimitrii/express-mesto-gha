const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  // ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

function getCards(req, res, next) {
  Card.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    });
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      next(err);
    });
}

function deleteCardById(req, res, next) {
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
      return Card.deleteOne(card)
        .then((deletedCard) => res.status(200)
          .send({ data: deletedCard }));
    })
    .catch((err) => {
      next(err);
    });
}

function likeCard(req, res, next) {
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
      next(err);
    });
}

function dislikeCard(req, res, next) {
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
      next(err);
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
