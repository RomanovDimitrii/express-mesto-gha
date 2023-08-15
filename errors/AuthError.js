class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'authError';
    this.statusCode = 401;
  }
}
module.exports = {
  AuthError,
};
