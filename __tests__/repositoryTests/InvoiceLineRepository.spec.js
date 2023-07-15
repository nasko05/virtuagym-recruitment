const {describe, expect, it} = require('@jest/globals');
const invoiceLineRepository = require('../../src/repository/InvoiceLineRepository.js');
const Invoice = require('../../src/models/InvoiceModel.js')
const InvoiceLine = require('../../src/models/InvoiceLineModel.js')

jest.mock('../../src/models/InvoiceLineModel.js');
jest.mock('../../src/models/InvoiceModel.js');
const inputInvoiceLine = {
    description: "123",
    amount: 123,
    invoiceId: 3
};
const expectedInvoiceLine = {
    id: 2,
    description: "123",
    amount: 123,
    invoiceId: 3
};
const oldInvoiceLine = {
    id: 2,
    description: "12",
    amount: 12,
    invoiceId: 3
}
const sampleInvoice = {
    id: 3,
    date: null,
    status: "Outstanding",
    description: "Test",
    amount: 123
}
describe('InvoiceLineRepository tests', function () {
    describe('CreateOne tests', function () {
        describe('Non existing invoice', function () {
            it('should throw new Error', async function () {
                Invoice.findByPk.mockReturnValue(null)
                await expect(invoiceLineRepository.createOne(inputInvoiceLine))
                    .rejects.toThrow(new Error('InvoiceLineRepository: Could not find invoice with id : 3'))
            });
        });
        describe('Successful persistence in database', function () {
            it('should return saved InvoiceLine', async function (){
                Invoice.findByPk.mockReturnValue(sampleInvoice)
                InvoiceLine.create.mockReturnValue(expectedInvoiceLine)
                let res = await invoiceLineRepository.createOne(inputInvoiceLine)
                expect(res.id).toBe(2)
                expect(res.description).toBe("123")
                expect(res.amount).toBe(123)
                expect(res.invoiceId).toBe(3)
            });
        });
        describe('Database could not save', function () {
            it('should throw new Error', async function () {
                Invoice.findByPk.mockReturnValue(sampleInvoice)
                InvoiceLine.create.mockImplementation(function () {
                    throw new Error()
                })
                await expect(invoiceLineRepository.createOne(inputInvoiceLine))
                    .rejects.toThrow(new Error(`InvoiceLineRepository: Could not create invoiceLine : ${inputInvoiceLine}`))

            });
        })
    });
    describe('FindAll tests',  function () {
        describe('No invoiceLines found', function () {
            it('should throw new Error', async function (){
                InvoiceLine.findAll.mockReturnValue(null)
                await expect(invoiceLineRepository.findAll())
                    .rejects.toThrow(new Error('InvoiceLineRepository: Could not find invoiceLine'))
            });
        });
        describe('InvoiceLines found',  function () {
            it("should return array of invoiceLines", async function () {
                InvoiceLine.findAll.mockReturnValue([expectedInvoiceLine])
                await expect(invoiceLineRepository.findAll())
                    .resolves.toStrictEqual([expectedInvoiceLine])
            });
        });
    });
    describe('FindById tests',  function () {
        describe('No invoiceLine found', function () {
            it('should throw new Error', async function () {
                InvoiceLine.findByPk.mockReturnValue(null)
                await expect(invoiceLineRepository.findById(4))
                    .rejects.toThrow(new Error('InvoiceLineRepository: Could not find invoiceLine with id : 4'))
            });
        });
        describe('InvoiceLine found',  function () {
            it("should return invoiceLine", async function () {
                InvoiceLine.findByPk.mockReturnValue(expectedInvoiceLine)
                await expect(invoiceLineRepository.findById(2))
                    .resolves.toStrictEqual(expectedInvoiceLine)
            });
        });
    });
    describe('UpdateOne tests', function () {
        describe('Nonexistent invoiceLine', function () {
            it('should throw new Error', async function () {
                InvoiceLine.findByPk.mockReturnValue(null)
                await expect(invoiceLineRepository.updateOne(4, inputInvoiceLine))
                    .rejects.toThrow(new Error('InvoiceLineRepository: Could not update invoiceLine with id : 4. Nonexistent InvoiceLine'))
            });
        });
        describe('Nonexistent invoice', function () {
            it('should throw new Error', async function () {
                InvoiceLine.findByPk.mockReturnValue(oldInvoiceLine)
                Invoice.findByPk.mockReturnValue(null)
                await expect(invoiceLineRepository.updateOne(2, inputInvoiceLine))
                    .rejects.toThrow(new Error('InvoiceLineRepository: Could not update invoiceLine with id : 2. Nonexistent Invoice'))
            });
        });
        describe('Zero updated rows', function () {
            it('should return updated invoiceLine', async function () {
                InvoiceLine.findByPk.mockReturnValue(oldInvoiceLine)
                Invoice.findByPk.mockReturnValue(sampleInvoice)
                InvoiceLine.update.mockReturnValue([0,[expectedInvoiceLine]])
                await expect(invoiceLineRepository.updateOne(2, inputInvoiceLine))
                    .rejects.toThrow(new Error(`InvoiceLineRepository: Could not update invoiceLine
                         with id : 2
                         invoiceLine : ${inputInvoiceLine}`))
            });
        });
        describe('Correct input info', function () {
            it('should return updated invoiceLine', async function () {
                InvoiceLine.findByPk.mockReturnValue(oldInvoiceLine)
                Invoice.findByPk.mockReturnValue(sampleInvoice)
                InvoiceLine.update.mockReturnValue([1,[expectedInvoiceLine]])
                let updated = await invoiceLineRepository.updateOne(2, inputInvoiceLine)
                expect(updated.id).toBe(2)
                expect(updated.description).toBe("123")
                expect(updated.amount).toBe(123)
                expect(updated.invoiceId).toBe(3)

            });
        });
    });
    describe('DeleteById tests', function () {
        describe('Nonexistent invoiceLine', function () {
            it('should throw new Error', async function () {
                InvoiceLine.findByPk.mockReturnValue(null)
                await expect(invoiceLineRepository.deleteById(10))
                    .rejects.toThrow(new Error('InvoiceLineRepository: Could not delete invoiceLine with id : 10'))
            });
        });
        describe('Found target invoiceLine', function () {
            it('should delete and return it', async function () {
                InvoiceLine.findByPk.mockReturnValue(expectedInvoiceLine)
                let deleted = await invoiceLineRepository.deleteById(2)
                expect(deleted.id).toBe(2)
                expect(deleted.description).toBe("123")
                expect(deleted.amount).toBe(123)
                expect(deleted.invoiceId).toBe(3)
            });
        });
    });
});