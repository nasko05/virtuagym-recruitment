const invoiceRouter = require('express').Router();
const invoiceController = require('../controllers/InvoiceController');

/* GET home page. */
invoiceRouter.post('/create/', invoiceController.createOne.bind(invoiceController));
invoiceRouter.get('/getAll/', invoiceController.findAll.bind(invoiceController));
invoiceRouter.get('/getOne/:id', invoiceController.findById.bind(invoiceController));
invoiceRouter.put('/updateOne/:id', invoiceController.updateOne.bind(invoiceController));
invoiceRouter.delete('/deleteOne/:id', invoiceController.deleteById.bind(invoiceController));

module.exports = invoiceRouter;
//TODO: Fix returning deleted object