const {
  ERROR_BAD_REQUEST,
  ERROR_EMAIL,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

module.exports = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(ERROR_EMAIL).send({
      message: 'Данный email уже зарегистрирован',
    });
  }

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

  if (err) {
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }

  return next(); // пропускаем запрос дальше
};
