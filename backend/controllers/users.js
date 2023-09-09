const { NODE_ENV, JWT_SECRET = 'dev-key' } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthError = require('../errors/auth-error');
const EmailError = require('../errors/email-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id отсутствует');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: user.toJSON() });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы неверные данные');
      } else if (err.name === 'MongoError') {
        throw new EmailError('Пользователь с таким email уже зарегистрирован');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const newUserName = req.body.name;
  const newUserAbout = req.body.about;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    {
      name: newUserName,
      about: newUserAbout,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы неправильные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const newUserAvatar = req.body.avatar;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: newUserAvatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы неправильные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-key', { expiresIn: '7d' });
        console.log(process.env.JWT_SECRET);
        res.send({ token });
      }
    })
    .catch(() => {
      throw new AuthError('Неправильный логин или пароль');
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Неправильный формат id');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
