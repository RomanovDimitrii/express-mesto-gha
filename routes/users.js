const router = require("express").Router();

const {
  getUsers,
  getUser,
  createUser,
  changeProfile,
  changeAvatar,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

router.patch("/me", changeProfile);

router.patch("/me/avatar", changeProfile);

module.exports = router;
