const { celebrate, Joi } = require("celebrate");

const signUpValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(
      /https?:\/\/(www)?[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/
    ),
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
      /https?:\/\/(www)?[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/
    ),
  }),
});

const createCardValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  signUpValidator,
  signInValidator,
  changeProfileValidator,
  changeAvatarValidator,
  createCardValidator,
};
