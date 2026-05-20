const express = require('express')
const authRouter = express.Router()
const authController = require('../controller/auth.controller')
const identifyUser = require('../middlewares/auth.middleware')


authRouter.post('/register', authController.registerController )

authRouter.post('/login' , authController.loginController)


authRouter.get('/get-me',identifyUser,authController.getMeController)


module.exports = authRouter 