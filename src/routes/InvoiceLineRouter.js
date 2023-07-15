const express = require('express')
let invoiceLineRouter = express.Router()
const invoiceLineController = require('../controllers/InvoiceLineController')
/* GET home page. */

invoiceLineRouter.post('/create/', invoiceLineController.createOne.bind(invoiceLineController))
invoiceLineRouter.get('/getAll/', invoiceLineController.findAll.bind(invoiceLineController))
invoiceLineRouter.get('/getOne/:id', invoiceLineController.findById.bind(invoiceLineController))
invoiceLineRouter.put('/updateOne/:id', invoiceLineController.updateOne.bind(invoiceLineController))
invoiceLineRouter.delete('/deleteOne/:id', invoiceLineController.deleteById.bind(invoiceLineController))

module.exports = invoiceLineRouter
