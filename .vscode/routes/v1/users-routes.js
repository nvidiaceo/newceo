const express = require("express");

const usersController = require("../../Controllers/v1/users-controller");

const router = express.Router();

router.post("/create", usersController.createUser);
router.post("/update", usersController.updateUser);
router.post("/delete", usersController.deleteUser);
router.post("/get-all", usersController.getUsers);

module.exports = router;
