const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret-key';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  //  console.log(token);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return false;
  }
}

module.exports = { generateToken, checkToken };
