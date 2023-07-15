class InvoiceService {
    constructor() {
        this.invoiceRepository = require('../repository/InvoiceRepository')
    }

    async createOne(invoice) {
        if(invoice == null
            || invoice.date === null
            || (
                invoice.status !== "Outstanding"
                && invoice.status !== "Paid"
                && invoice.status !== "Void"
            )
            || invoice.description === null
            || invoice.description === ""
            || invoice.amount === null
            || invoice.amount < 0)
            throw new Error("InvoiceService: Invalid input")
        return await this.invoiceRepository.createOne(invoice)
    }

    async findAll() {
        return await this.invoiceRepository.findAll()
    }

    async findById(id){
        if(id === null
            || id < 0)
            throw new Error("InvoiceService: Id cannot be null or zero")
        return await this.invoiceRepository.findById(id)
    }

    async updateOne(id, updatedInvoice){
        if(id === null
            || id < 0)
            throw new Error("InvoiceService: Id cannot be null or zero")
        if(updatedInvoice == null
            || updatedInvoice.date === null
            || (
                updatedInvoice.status !== "Outstanding"
                && updatedInvoice.status !== "Paid"
                && updatedInvoice.status !== "Void"
            )
            || updatedInvoice.description === null
            || updatedInvoice.description === ""
            || updatedInvoice.amount === null
            || updatedInvoice.amount < 0)
            throw new Error("InvoiceService: Invalid input")
        return await this.invoiceRepository.updateOne(id, updatedInvoice)
    }

    async deleteById(id) {
        if(id === null
            || id < 0)
            throw new Error("InvoiceService: Id cannot be null or zero")
        return await this.invoiceRepository.deleteById(id)
    }
}

module.exports = new InvoiceService()