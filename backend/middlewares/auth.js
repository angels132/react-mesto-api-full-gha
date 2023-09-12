const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

const { JWT_SECRET } = process.env;

const extractBearerToken = function (header) {
  return header.replace('Bearer ', '');
};

//* мидлвара авторизации - проверяет наличие токена и верифицирует его
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-key');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};

module.exports = auth;
