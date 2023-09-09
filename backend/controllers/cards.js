const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const WrongIdError = require('../errors/auth-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        throw new WrongIdError('Можно удалять только свои карточки');
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Невалидный id карточки');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundError('Переданы некорректные данные при создании карточки.');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
