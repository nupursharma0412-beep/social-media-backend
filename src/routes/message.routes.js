const express = require("express");
const router = express.Router();
const identifyUser = require("../middlewares/auth.middleware");

const messageController = require("../controller/message.controller");

router.post(
  "/",
  identifyUser,
  messageController.sendMessageController
);

router.get(
  "/:userId",
  identifyUser,
  messageController.getMessagesController
);

module.exports = router;