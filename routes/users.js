const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  createUser,
  changeProfile,
  login,
  getUserProfile,
} = require('../controllers/users');

const {
  signUpValidator,
  signInValidator,
  changeProfileValidator,
  changeAvatarValidator,
  userIdValidator,
} = require('../utils/validators');

router.post('/signup', signUpValidator, createUser);

router.post('/signin', signInValidator, login);

router.get('/', auth, getUsers);

router.get('/me', auth, getUserProfile);

router.get('/:id', auth, userIdValidator, getUserById);

router.patch('/me', auth, changeProfileValidator, changeProfile);

router.patch('/me/avatar', auth, changeAvatarValidator, changeProfile);

module.exports = router;
