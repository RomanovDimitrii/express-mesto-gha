const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

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

app.use((req, res, next) => {
  req.user = {
    _id: '64cf87c4b33526506de854e5',
  };

  next();
});

app.use('/users', userRouter);

app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: `Ресурс по адресу ${req.path} не найден` });
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT} `);
});
