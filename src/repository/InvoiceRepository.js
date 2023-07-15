const Invoice = require("../models/InvoiceModel")
class InvoiceRepository {

    async createOne(invoice) {
        try {
            return await Invoice.create(invoice)
        } catch (err) {
            throw new Error(`InvoiceRepository: Could not create invoice : ${invoice}`)
        }
    }

    async findAll() {
        let res = await Invoice.findAll()
        if(res === null)
            throw new Error('InvoiceRepository: Could not find invoice')
        return res
    }

    async findById(id) {
        let res = await Invoice.findByPk(id)
        if(res === null)
            throw new Error(`InvoiceRepository: Could not find invoice with id : ${id}`)
        return res
    }

    async updateOne(id, updatedInvoice) {
        if(await Invoice.findByPk(id) === null){
            throw new Error(`InvoiceRepository: Could not update invoice with id : ${id}`)
        }
        const [rowsUpdated, [updatedRows]] = await Invoice.update(updatedInvoice, {
            returning: true,
            where: {id},
        })
        if (rowsUpdated !== 1) {
            throw new Error(`InvoiceRepository: Could not update invoice
                         with id : ${id}
                         invoice : ${updatedInvoice}`)
        }
        return updatedRows
    }

    async deleteById(id) {
        if(await Invoice.findByPk(id) === null){
            throw new Error(`InvoiceRepository: Could not delete invoice with id : ${id}`)
        }
        let rowToBeDeleted = await Invoice.findByPk(id)
        await Invoice.destroy({
            where: {id},
        });
        return rowToBeDeleted
    }
}

module.exports = new InvoiceRepository()
