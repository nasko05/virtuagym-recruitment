const express = require('express')
const checkInRouter = express.Router()
const checkInController = require('../controllers/CheckInController')
/* GET home page. */

checkInRouter.post('/:userId/', checkInController.authorize.bind(checkInController))

module.exports = checkInRouter
