class UnallowedActionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnallowedActionError';
    this.statusCode = 403;
  }
}
module.exports = {
  UnallowedActionError,
};
