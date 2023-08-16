const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // импортируем bcrypt

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  about: {
    type: String,
  },
  avatar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return /\w+@\w+\.\w+/.test(v);
      },
      message: (props) => `${props.value} некорректный email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password') // из-за запрета возврата хеш пароля
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('user', userSchema);
