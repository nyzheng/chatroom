const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");
const ooxxController = require("../controllers/ooxxController");
const chatroomController = require("../controllers/chatroomController.js");

router.get("/", controller.welcomePage);
router.get("/register", controller.registerPage);
router.get("/logout", controller.logout);
router.get("/update", controller.passwordPage);
router.get("/chat", chatroomController.chatPage);
router.get("/ooxx", ooxxController.ooxxPage);

router.post("/login", controller.login);
router.post("/register-request", controller.registerPost);
router.post("/update", controller.updatePost);

module.exports = router;
