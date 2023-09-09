require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
});

const app = express();

app.use(cors());

app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());

app.use(requestLogger);
app.use(router);
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => { });
