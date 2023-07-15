const InvoiceLine = require("../models/InvoiceLineModel")
const Invoice = require('../models/InvoiceModel')
class InvoiceLineRepository {

    async createOne(invoiceLine) {
        if(await Invoice.findByPk(invoiceLine.invoiceId) === null){
            throw new Error(`InvoiceLineRepository: Could not find invoice with id : ${invoiceLine.invoiceId}`)
        }
        try {
            return await InvoiceLine.create(invoiceLine)
        } catch (err) {
            throw new Error(`InvoiceLineRepository: Could not create invoiceLine : ${invoiceLine}`)
        }
    }

    async findAll() {
        let res = await InvoiceLine.findAll()
        if(res === null)
            throw new Error('InvoiceLineRepository: Could not find invoiceLine')
        return res
    }

    async findById(id) {
        let res = await InvoiceLine.findByPk(id)
        if(res === null)
            throw new Error(`InvoiceLineRepository: Could not find invoiceLine with id : ${id}`)
        return res
    }

    async updateOne(id, updatedInvoiceLine) {
        if(await InvoiceLine.findByPk(id) === null){
            throw new Error(`InvoiceLineRepository: Could not update invoiceLine with id : ${id}. Nonexistent InvoiceLine`)
        }
        if(await Invoice.findByPk(updatedInvoiceLine.invoiceId) === null) {
            throw new Error(`InvoiceLineRepository: Could not update invoiceLine with id : ${id}. Nonexistent Invoice`)
        }
        const [rowsUpdated, [updatedRows]] = await InvoiceLine.update(updatedInvoiceLine, {
            returning: true,
            where: {id},
        })
        if (rowsUpdated !== 1) {
            throw new Error(`InvoiceLineRepository: Could not update invoiceLine
                         with id : ${id}
                         invoiceLine : ${updatedInvoiceLine}`)
        }
        return updatedRows
    }

    async deleteById(id) {
        if(await InvoiceLine.findByPk(id) === null){
            throw new Error(`InvoiceLineRepository: Could not delete invoiceLine with id : ${id}`)
        }
        let rowToBeDeleted = await InvoiceLine.findByPk(id)
        await InvoiceLine.destroy({
            where: {id},
        });
        return rowToBeDeleted
    }
}

module.exports = new InvoiceLineRepository()
