const { checkToken } = require('../utils/token');
const { AuthError } = require('../errors/AuthError');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    // return res.status(401).send({ message: 'Необходима авторизация1' });
    throw new AuthError('Токен не верифицирован');
  }
  const token = req.cookies.jwt;

  const payload = checkToken(token);
  // console.log(payload);
  if (!payload) {
    // return res.status(401).send({ message: 'Токен не верифицирован' });
    throw new AuthError('Токен не верифицирован');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
