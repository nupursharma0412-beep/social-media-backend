const express = require("express");
const router = express.Router();
const commentController = require("../controller/comment.controller");
const identifyUser = require("../middlewares/auth.middleware");

router.post("/:postId", identifyUser, commentController.addCommentController);
router.get("/:postId", identifyUser, commentController.getCommentsController);

module.exports = router;