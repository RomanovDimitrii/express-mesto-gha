const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const auth = require("../middlewares/auth");

const {
  getUsers,
  getUserById,
  createUser,
  changeProfile,
  login,
  getUserProfile,
} = require("../controllers/users");

router.post(
  "/signup",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required().min(8),
      })
      .unknown(true),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required().min(8),
      })
      .unknown(true),
  }),
  login
);

router.get("/", auth, getUsers);

router.get("/me", auth, getUserProfile);

router.get("/:id", auth, getUserById);

router.patch("/me", auth, changeProfile);

router.patch("/me/avatar", auth, changeProfile);

module.exports = router;
