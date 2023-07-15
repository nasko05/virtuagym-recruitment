const {describe, expect, it} = require('@jest/globals');
const invoiceService = require('../../src/services/InvoiceService.js');
const invoiceRepository = require('../../src/repository/InvoiceRepository.js');

jest.mock('../../src/repository/InvoiceRepository');

describe("invoiceService Unit tests", function () {
    describe("CreateOne tests", function () {
        describe("Invoice is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.createOne(null)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice date is null", function () {
            it("should throw Error", async function () {
                const dateNull = {
                    date: null,
                    status: "Outstanding",
                    description: "Test",
                    amount: 123
                }
                await expect(invoiceService.createOne(dateNull)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice status is invalid", function () {
            it("should throw Error", async function () {
                const statusInvalid = {
                    date: Date.now(),
                    status: "Something",
                    description: "Test",
                    amount: 123
                }
                await expect(invoiceService.createOne(statusInvalid)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice description is null", function () {
            it("should throw Error", async function () {
                const descriptionNull = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: null,
                    amount: 123
                }
                await expect(invoiceService.createOne(descriptionNull)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice description is empty", function () {
            it("should throw Error", async function () {
                const descriptionEmpty = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: "",
                    amount: 123
                }
                await expect(invoiceService.createOne(descriptionEmpty)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice amount is null", function () {
            it("should throw Error", async function () {
                const amountNull = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: "123",
                    amount: null
                }
                await expect(invoiceService.createOne(amountNull)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice amount is lower than 0", function () {
            it("should throw Error", async function () {
                const amountNegative = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: "123",
                    amount: -5
                }
                await expect(invoiceService.createOne(amountNegative)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });

        describe("Invoice is valid", function () {
            it("should return valid saved Invoice", async function () {
                const date = Date.now()
                const inputInvoice = {
                    date: date,
                    status: "Outstanding",
                    description: "123",
                    amount: 123
                };
                const expectedInvoice = {
                    id: 7,
                    date: date,
                    status: "Outstanding",
                    description: "123",
                    amount: 123
                };
                invoiceRepository.createOne.mockReturnValue(expectedInvoice);
                const result = await invoiceService.createOne(inputInvoice)
                expect(result.id).toBe(7)
                expect(result.date).toBe(date)
                expect(result.status).toBe("Outstanding")
                expect(result.description).toBe("123")
                expect(result.amount).toBe(123)
            });
        });
    });
    describe("FindAll tests", function () {
        describe("No Invoices found", function () {
            it("should throw Error", async function () {
                invoiceRepository.findAll.mockImplementation(function () {
                    throw new Error('InvoiceService: Could not find invoice');
                });
                await expect(invoiceService.findAll()).rejects.toThrow(new Error('InvoiceService: Could not find invoice'))
            });
        });
        describe('Found Invoices', function () {
            it("should return them as a array", async function () {
                const expectedInvoices = [{
                    id: 1,
                    date: Date.now(),
                    status: "Outstanding",
                    description: "123",
                    amount: 123
                }];
                invoiceRepository.findAll.mockImplementation(function () {
                    return expectedInvoices
                });
                await expect(invoiceService.findAll()).resolves.toBe(expectedInvoices)
            });
        });
    });
    describe("FindById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.findById(-1)).rejects.toThrow(new Error('InvoiceService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.findById(null)).rejects.toThrow(new Error('InvoiceService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return valid Invoice object", async function () {
                const expectedInvoice = {
                    id: 4,
                    date: Date.now(),
                    status: "Outstanding",
                    description: "123",
                    amount: 123
                };
                invoiceRepository.findById.mockReturnValue(expectedInvoice)
                await expect(invoiceService.findById(4)).resolves.toBe(expectedInvoice)
            });
        });
    });
    describe("UpdateOne tests", function () {
        const inputInvoice = {
            date: Date.now(),
            status: "Outstanding",
            description: "123",
            amount: 123
        };
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.updateOne(-1, inputInvoice)).rejects.toThrow(new Error('InvoiceService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.updateOne(null, inputInvoice)).rejects.toThrow(new Error('InvoiceService: Id cannot be null or zero'))
            });
        });
        describe("Invoice is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.updateOne(1, null)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice date is null", function () {
            it("should throw Error", async function () {
                const dateNull = {
                    date: null,
                    status: "Outstanding",
                    description: "Test",
                    amount: 123
                }
                await expect(invoiceService.updateOne(1, dateNull)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice status is invalid", function () {
            it("should throw Error", async function () {
                const statusInvalid = {
                    date: Date.now(),
                    status: "Something",
                    description: "Test",
                    amount: 123
                }
                await expect(invoiceService.updateOne(1, statusInvalid)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice description is null", function () {
            it("should throw Error", async function () {
                const descriptionNull = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: null,
                    amount: 123
                }
                await expect(invoiceService.updateOne(1, descriptionNull)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice description is empty", function () {
            it("should throw Error", async function () {
                const descriptionEmpty = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: "",
                    amount: 123
                }
                await expect(invoiceService.updateOne(1, descriptionEmpty)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice amount is null", function () {
            it("should throw Error", async function () {
                const amountNull = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: "123",
                    amount: null
                }
                await expect(invoiceService.updateOne(1, amountNull)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });
        describe("Invoice amount is lower than 0", function () {
            it("should throw Error", async function () {
                const amountNegative = {
                    date: Date.now(),
                    status: "Outstanding",
                    description: "123",
                    amount: -5
                }
                await expect(invoiceService.updateOne(1, amountNegative)).rejects.toThrow(new Error('InvoiceService: Invalid input'));
            });
        });

        describe("Invoice is valid", function () {
            it("should return valid updated Invoice", async function () {
                const date = Date.now()
                const inputInvoice = {
                    date: date,
                    status: "Outstanding",
                    description: "123",
                    amount: 123
                };
                const expectedInvoice = {
                    id: 5,
                    date: date,
                    status: "Outstanding",
                    description: "123",
                    amount: 123
                };
                invoiceRepository.updateOne.mockReturnValue(expectedInvoice);
                const result = await invoiceService.updateOne(1, inputInvoice)
                expect(result.id).toBe(5)
                expect(result.date).toBe(date)
                expect(result.status).toBe("Outstanding")
                expect(result.description).toBe("123")
                expect(result.amount).toBe(123)
            });
        });
    });
    describe("DeleteById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.deleteById(-1)).rejects.toThrow(new Error('InvoiceService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(invoiceService.deleteById(null)).rejects.toThrow(new Error('InvoiceService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return the deleted Invoice", async function () {
                const date = Date.now()
                const expectedInvoice = {
                    id: 2,
                    date: date,
                    status: "Outstanding",
                    description: "123",
                    amount: 123
                };
                invoiceRepository.deleteById.mockImplementation(function () {
                    return expectedInvoice
                })
                await expect(invoiceService.deleteById(5)).resolves.toBe(expectedInvoice)
            })
        })
    })
});
