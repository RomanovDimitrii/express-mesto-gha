const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { createCardValidator } = require('../utils/validators');

router.get('/', auth, getCards);

router.post('/', auth, createCardValidator, createCard);

router.delete('/:cardId', auth, deleteCardById);

router.put('/:cardId/likes', auth, likeCard);

router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;
