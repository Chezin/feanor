import * as usersController from "../controllers/usersController";
var express = require("express");

const router = express.Router();
router
	.route("/")
	.get(usersController.getAllUsers)
	.post(usersController.createUser)
	.patch(usersController.updateUser)
	.delete(usersController.deleteUser);

module.exports = router;
