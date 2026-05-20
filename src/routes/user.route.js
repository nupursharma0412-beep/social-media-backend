const express = require('express');
const userController = require('../controller/user.controller');
const identifyUser = require('../middlewares/auth.middleware');
const multer = require('multer');

const userRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

userRouter.put(
  "/profile-image",
  identifyUser,
  upload.single("profile"),
  userController.updateProfileImage
);

userRouter.put(
  "/edit",
  identifyUser,
  userController.updateProfileController
);


userRouter.get(
  "/chat-users",
  identifyUser,
  userController.getChatUsersController
);

// FOLLOW / UNFOLLOW
userRouter.post('/follow/:userid', identifyUser, userController.followUserController);
userRouter.post('/unfollow/:userid', identifyUser, userController.unfollowUserController);


userRouter.get(
  '/:id',
  identifyUser,
  userController.getUserProfileController
);

module.exports = userRouter;