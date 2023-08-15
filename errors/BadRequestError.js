class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'badRequestError';
    this.statusCode = 404;
  }
}

module.exports = {
  BadRequestError,
};
