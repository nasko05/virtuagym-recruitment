const {describe, expect, it} = require('@jest/globals');
const invoiceRepository = require('../../src/repository/InvoiceRepository.js');
const Invoice = require('../../src/models/InvoiceModel.js')

jest.mock('../../src/models/InvoiceModel.js');
const date = Date.now()
const inputInvoice = {
    date: date,
    status: "Outstanding",
    description: "Not yet paid",
    amount: 260
};
const expectedInvoice = {
    id: 2,
    date: date,
    status: "Void",
    description: "Invalid invoice",
    amount: 260
};
const oldInvoice = {
    id: 2,
    date: date,
    status: "Outstanding",
    description: "Not yet paid",
    amount: 260
}
describe('InvoiceRepository tests', () => {
    describe('CreateOne tests', () => {
        describe('Successful persistence in database', () => {
            it('should return saved InvoiceLine', async function (){
                Invoice.create.mockReturnValue(expectedInvoice)
                let res = await invoiceRepository.createOne(inputInvoice)
                expect(res.id).toBe(2)
                expect(res.date).toBe(date)
                expect(res.status).toBe("Void")
                expect(res.description).toBe("Invalid invoice")
                expect(res.amount).toBe(260)
            });
        });

        describe('Database could not save', function () {
            it('should throw new Error', async function () {
                Invoice.create.mockImplementation(function () {
                    throw new Error()
                })
                await expect(invoiceRepository.createOne(inputInvoice))
                    .rejects.toThrow(new Error(`InvoiceRepository: Could not create invoice : ${inputInvoice}`))

            });
        })
    });
    describe('FindAll tests',  () => {
        describe('No invoices found', () => {
            it('should throw new Error', async function (){
                Invoice.findAll.mockReturnValue(null)
                await expect(invoiceRepository.findAll())
                    .rejects.toThrow(new Error('InvoiceRepository: Could not find invoice'))
            });
        });
        describe('InvoiceLines found',  () => {
            it("should return array of invoices", async function () {
                Invoice.findAll.mockReturnValue([expectedInvoice])
                await expect(invoiceRepository.findAll())
                    .resolves.toStrictEqual([expectedInvoice])
            });
        });
    });
    describe('FindById tests',  () => {
        describe('No invoice found', () => {
            it('should throw new Error', async function () {
                Invoice.findByPk.mockReturnValue(null)
                await expect(invoiceRepository.findById(4))
                    .rejects.toThrow(new Error('InvoiceRepository: Could not find invoice with id : 4'))
            });
        });
        describe('InvoiceLine found',  () => {
            it("should return invoice", async function () {
                Invoice.findByPk.mockReturnValue(expectedInvoice)
                await expect(invoiceRepository.findById(2))
                    .resolves.toStrictEqual(expectedInvoice)
            });
        });
    });
    describe('UpdateOne tests', () => {
        describe('Nonexistent invoice', () => {
            it('should throw new Error', async function () {
                Invoice.findByPk.mockReturnValue(null)
                await expect(invoiceRepository.updateOne(4, inputInvoice))
                    .rejects.toThrow(new Error('InvoiceRepository: Could not update invoice with id : 4'))
            });
        });
        describe('Correct input info', function () {
            it('should return updated invoice', async function () {
                Invoice.findByPk.mockReturnValue(oldInvoice)
                Invoice.update.mockReturnValue([1,[expectedInvoice]])
                let updated = await invoiceRepository.updateOne(2, inputInvoice)
                expect(updated.id).toBe(2)
                expect(updated.date).toBe(date)
                expect(updated.status).toBe("Void")
                expect(updated.description).toBe("Invalid invoice")
                expect(updated.amount).toBe(260)

            });
        });
        describe('Zero updated rows', function () {
            it('should return updated invoiceLine', async function () {
                Invoice.findByPk.mockReturnValue(inputInvoice)
                Invoice.update.mockReturnValue([0,[expectedInvoice]])
                await expect(invoiceRepository.updateOne(2, inputInvoice))
                    .rejects.toThrow(new Error(`InvoiceRepository: Could not update invoice
                         with id : 2
                         invoice : ${inputInvoice}`))
            });
        });
    });
    describe('DeleteById tests', function () {
        describe('Nonexistent invoice', function () {
            it('should throw new Error', async function () {
                Invoice.findByPk.mockReturnValue(null)
                await expect(invoiceRepository.deleteById(10))
                    .rejects.toThrow(new Error('InvoiceRepository: Could not delete invoice with id : 10'))
            });
        });
        describe('Found target invoice', function () {
            it('should delete and return it', async function () {
                Invoice.findByPk.mockReturnValue(expectedInvoice)
                let deleted = await invoiceRepository.deleteById(2)
                expect(deleted.id).toBe(2)
                expect(deleted.date).toBe(date)
                expect(deleted.status).toBe("Void")
                expect(deleted.description).toBe("Invalid invoice")
                expect(deleted.amount).toBe(260)
            });
        });
    });
});