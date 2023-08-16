const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandleMiddleware = require('./middlewares/errorHandleMiddleware');
const { createUser, login } = require('./controllers/users');
const { signUpValidator, signInValidator } = require('./utils/validators');
const { notFoundErr } = require('./errors/errors');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
});

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(express.json()); // вместо bodyParser

app.use(cookieParser());

app.use(helmet());

app.use(cors());

app.use(limiter);

app.post('/signin', signInValidator, login);

app.post('/signup', signUpValidator, createUser);

app.use('/users', userRouter);

app.use('/cards', cardsRouter);

app.use(errors()); // обработчик ошибок celebrate

app.use('/*', notFoundErr);
// app.use((req, res, next) => {
//   next(new notFoundError("Такого адреса не существует"));
//  res.status(404).send({ message: `Ресурс по адресу ${req.path} не найден` });
// });

app.use(errorHandleMiddleware);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT} `);
});
