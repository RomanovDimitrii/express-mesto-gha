const { checkToken } = require('../utils/token');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    return res.status(401).send({ message: 'Необходима авторизация1' });
  }
  const token = req.cookies.jwt;

  const payload = checkToken(token);
  // console.log(payload);
  if (!payload) {
    return res.status(401).send({ message: 'Токен не верифицирован' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
