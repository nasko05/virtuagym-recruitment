const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/UserController')
/* GET home page. */

userRouter.post('/create/', userController.createOne.bind(userController))
userRouter.get('/getAll/', userController.findAll.bind(userController))
userRouter.get('/getOne/:id', userController.findById.bind(userController))
userRouter.put('/updateOne/:id', userController.updateOne.bind(userController))
userRouter.delete('/deleteOne/:id', userController.deleteById.bind(userController))

module.exports = userRouter
