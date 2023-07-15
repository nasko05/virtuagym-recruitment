const {describe, expect, it} = require('@jest/globals');
const invoiceLineService = require('../../src/services/InvoiceLineService.js');
const invoiceLineRepository = require('../../src/repository/InvoiceLineRepository.js');

jest.mock('../../src/repository/InvoiceLineRepository');

describe("InvoiceLineService Unit tests", function () {
    describe("CreateOne tests", function () {
        describe("InvoiceLine is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.createOne(null)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine description is null", function () {
            it("should throw Error", async function () {
                const descriptionNull = {
                    description: null,
                    amount: 123,
                    invoiceId: 3
                }
                await expect(invoiceLineService.createOne(descriptionNull)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine description is empty", function () {
            it("should throw Error", async function () {
                const descriptionEmpty = {
                    description: "",
                    amount: 123,
                    invoiceId: 3
                }
                await expect(invoiceLineService.createOne(descriptionEmpty)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine amount is null", function () {
            it("should throw Error", async function () {
                const amountNull = {
                    description: "123",
                    amount: null,
                    invoiceId: 3
                }
                await expect(invoiceLineService.createOne(amountNull)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine amount is lower than 0", function () {
            it("should throw Error", async function () {
                const amountNegative = {
                    description: "123",
                    amount: -5,
                    invoiceId: 3
                }
                await expect(invoiceLineService.createOne(amountNegative)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });

        describe("InvoiceLine is valid", function () {
            it("should return valid saved InvoiceLine", async function () {
                Date.now();
                const inputInvoiceLine = {
                    description: "123",
                    amount: 123,
                    invoiceId: 3
                };
                const expectedInvoiceLine = {
                    id: 1,
                    description: "123",
                    amount: 123,
                    invoiceId: 3
                };
                invoiceLineRepository.createOne.mockReturnValue(expectedInvoiceLine);
                const result = await invoiceLineService.createOne(inputInvoiceLine)
                expect(result.id).toBe(1)
                expect(result.description).toBe("123")
                expect(result.amount).toBe(123)
                expect(result.invoiceId).toBe(3)
            });
        });
    });
    describe("FindAll tests", function () {
        describe("No InvoiceLines found", function () {
            it("should throw Error", async function () {
                invoiceLineRepository.findAll.mockImplementation(function () {
                    throw new Error('InvoiceLineService: Could not find InvoiceLine');
                });
                await expect(invoiceLineService.findAll()).rejects.toThrow(new Error('InvoiceLineService: Could not find InvoiceLine'))
            });
        });
        describe('Found InvoiceLines', function () {
            it("should return them as a array", async function () {
                const expectedInvoiceLines = [{
                    id: 1,
                    description: "123",
                    amount: 123,
                    invoiceId: 3
                }];
                invoiceLineRepository.findAll.mockImplementation(function () {
                    return expectedInvoiceLines
                });
                await expect(invoiceLineService.findAll()).resolves.toBe(expectedInvoiceLines)
            });
        });
    });
    describe("FindById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.findById(-1)).rejects.toThrow(new Error('InvoiceLineService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.findById(null)).rejects.toThrow(new Error('InvoiceLineService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return valid InvoiceLine object", async function () {
                const expectedInvoiceLine = {
                    id: 4,
                    description: "123",
                    amount: 123,
                    invoiceId: 3
                };
                invoiceLineRepository.findById.mockReturnValue(expectedInvoiceLine)
                await expect(invoiceLineService.findById(4)).resolves.toBe(expectedInvoiceLine)
            });
        });
    });
    describe("UpdateOne tests", function () {
        const inputInvoiceLine = {
            description: "123",
            amount: 123,
            invoiceId: 3
        };
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.updateOne(-1, inputInvoiceLine)).rejects.toThrow(new Error('InvoiceLineService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.updateOne(null, inputInvoiceLine)).rejects.toThrow(new Error('InvoiceLineService: Id cannot be null or zero'))
            });
        });
        describe("InvoiceLine is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.updateOne(1, null)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine description is null", function () {
            it("should throw Error", async function () {
                const descriptionNull = {
                    description: null,
                    amount: 123,
                    invoiceId: 3
                }
                await expect(invoiceLineService.updateOne(1, descriptionNull)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine description is empty", function () {
            it("should throw Error", async function () {
                const descriptionEmpty = {
                    description: "",
                    amount: 123,
                    invoiceId: 3
                }
                await expect(invoiceLineService.updateOne(1, descriptionEmpty)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine amount is null", function () {
            it("should throw Error", async function () {
                const amountNull = {
                    description: "123",
                    amount: null,
                    invoiceId: 3
                }
                await expect(invoiceLineService.updateOne(1, amountNull)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });
        describe("InvoiceLine amount is lower than 0", function () {
            it("should throw Error", async function () {
                const amountNegative = {
                    description: "123",
                    amount: -5,
                    invoiceId: 3
                }
                await expect(invoiceLineService.updateOne(1, amountNegative)).rejects.toThrow(new Error('InvoiceLineService: Invalid input'));
            });
        });

        describe("InvoiceLine is valid", function () {
            it("should return valid updated InvoiceLine", async function () {
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
                invoiceLineRepository.updateOne.mockReturnValue(expectedInvoiceLine);
                const result = await invoiceLineService.updateOne(2, inputInvoiceLine)
                expect(result.id).toBe(2)
                expect(result.description).toBe("123")
                expect(result.amount).toBe(123)
            });
        });
    });
    describe("DeleteById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.deleteById(-1)).rejects.toThrow(new Error('InvoiceLineService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceLineService.deleteById(null)).rejects.toThrow(new Error('InvoiceLineService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return the deleted InvoiceLine", async function () {
                Date.now();
                const expectedInvoiceLine = {
                    id: 2,
                    description: "123",
                    amount: 123,
                    invoiceId: 3
                };
                invoiceLineRepository.deleteById.mockImplementation(function () {
                    return expectedInvoiceLine
                })
                await expect(invoiceLineService.deleteById(5)).resolves.toBe(expectedInvoiceLine)
            })
        })
    })
});
