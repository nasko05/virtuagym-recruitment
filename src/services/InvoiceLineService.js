class InvoiceLineService {
    constructor() {
        this.invoiceLineRepository = require('../repository/InvoiceLineRepository')
    }
    async createOne(invoiceLine) {
        if(invoiceLine == null
            || invoiceLine.description === null
            || invoiceLine.description === ""
            || invoiceLine.amount === null
            || invoiceLine.amount < 0)
            throw new Error("InvoiceLineService: Invalid input")
        return await this.invoiceLineRepository.createOne(invoiceLine)
    }

    async findAll() {
        return await this.invoiceLineRepository.findAll()
    }

    async findById(id) {
        if(id === null
            || id < 0)
            throw new Error("InvoiceLineService: Id cannot be null or zero")
        return await this.invoiceLineRepository.findById(id)
    }

    async updateOne(id, updatedInvoiceLine) {
        if(id === null
            || id < 0)
            throw new Error("InvoiceLineService: Id cannot be null or zero")
        else if(updatedInvoiceLine == null
            || updatedInvoiceLine.description === null
            || updatedInvoiceLine.description === ""
            || updatedInvoiceLine.amount === null
            || updatedInvoiceLine.amount < 0)
            throw new Error("InvoiceLineService: Invalid input")
        return await this.invoiceLineRepository.updateOne(id, updatedInvoiceLine)
    }

    async deleteById(id) {
        if(id === null
            || id < 0)
            throw new Error("InvoiceLineService: Id cannot be null or zero")
        return await this.invoiceLineRepository.deleteById(id)
    }
}

module.exports = new InvoiceLineService()