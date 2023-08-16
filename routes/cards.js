const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { createCardValidator, idValidator } = require('../utils/validators');

router.get('/', auth, getCards);

router.post('/', auth, createCardValidator, createCard);

router.delete('/:cardId', auth, idValidator, deleteCardById);

router.put('/:cardId/likes', auth, idValidator, likeCard);

router.delete('/:cardId/likes', auth, idValidator, dislikeCard);

module.exports = router;
