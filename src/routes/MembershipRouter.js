const express = require('express')
const membershipRouter = express.Router()
const membershipController = require('../controllers/MembershipController')
/* GET home page. */

membershipRouter.post('/create/', membershipController.createOne.bind(membershipController))
membershipRouter.get('/getAll/', membershipController.findAll.bind(membershipController))
membershipRouter.get('/getOne/:id', membershipController.findById.bind(membershipController))
membershipRouter.put('/updateOne/:id', membershipController.updateOne.bind(membershipController))
membershipRouter.delete('/deleteOne/:id', membershipController.deleteById.bind(membershipController))

module.exports = membershipRouter
