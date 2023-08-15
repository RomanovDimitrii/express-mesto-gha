const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandleMiddleware = require('./middlewares/errorHandleMiddleware');
const { createUser, login } = require('./controllers/users');
const { signUpValidator, signInValidator } = require('./utils/validators');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const app = express();

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(express.json()); // вместо bodyParser

app.use(cookieParser());

app.use(cors());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64cf87c4b33526506de854e5',
//   };

//   next();
// });

app.post('/signin', signInValidator, login);

app.post('/signup', signUpValidator, createUser);

app.use('/users', userRouter);

app.use('/cards', cardsRouter);

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandleMiddleware);

app.use((req, res) => {
  res.status(404).send({ message: `Ресурс по адресу ${req.path} не найден` });
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT} `);
});
