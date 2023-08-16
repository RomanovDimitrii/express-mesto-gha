// (https?:\/\/)(www)?[0-9a-z\-._~:/?#[\]@!$'()*+,;=]+#?$/i
// (https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,63}\.)([a-zA-Z]{2,4})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/

const { celebrate, Joi } = require('celebrate');

const regExAvatar = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,63}\.)([a-zA-Z]{2,4})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;

const signUpValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regExAvatar),
  }),
  //     .unknown(true),  //позволяет в запрос включать другие поля,помимо email и password
});

const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
  //     .unknown(true),  //позволяет в запрос включать другие поля,помимо email и password
});

const changeProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const changeAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(
      regExAvatar,
    ),
  }),
});

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(regExAvatar).required(),
  }),
});

const userIdValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const idValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  signUpValidator,
  signInValidator,
  changeProfileValidator,
  changeAvatarValidator,
  createCardValidator,
  userIdValidator,
  idValidator,
};
