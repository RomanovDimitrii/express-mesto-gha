const { NotFoundError } = require('./NotFoundError');

const ERROR_BAD_REQUEST = 400;
const ERROR_AUTIFICATION = 401;
const ERROR_UNALLOWED_ACTION = 403;
const ERROR_NOT_FOUND = 404;
const ERROR_EMAIL = 409;
const ERROR_INTERNAL_SERVER = 500;

function notFoundErr() {
  throw new NotFoundError('Такого адреса не существует');
}

module.exports = {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_EMAIL,
  ERROR_INTERNAL_SERVER,
  ERROR_UNALLOWED_ACTION,
  ERROR_AUTIFICATION,
  notFoundErr,
};
