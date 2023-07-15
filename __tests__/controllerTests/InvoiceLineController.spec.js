const request = require('supertest');
const app = require('../../app');
const invoiceLineService = require('../../src/services/InvoiceLineService');
const {describe,
    it,
    expect
} = require('@jest/globals')

jest.mock('../../src/services/InvoiceLineService'); // Mock the InvoiceLineService module

describe('InvoiceLineController', () => {
    describe('POST /invoiceLine', () => {
        it('should create a new invoice line', async () => {
            // Mock the createOne method of the InvoiceLineService

            const invoiceLineObj = {
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: 4
            };

            invoiceLineService.createOne.mockReturnValue(invoiceLineObj);
            const response = await request(app)
                .post('/invoiceLine/create')
                .send(invoiceLineObj);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(invoiceLineObj);
        });

        it('should return 400 if object received is null', async () => {
            const response = await request(app)
                .post('/invoiceLine/create')
                .send(null);

            expect(response.status).toBe(400);
            expect(response.text).toBe('Object received is null');
        });

        it('should return 400 if object received is invalid', async () => {
            // Mock the createOne method of the InvoiceLineService to throw an error
            invoiceLineService.createOne.mockImplementation(() => {
                    throw new Error('Invalid object')
                });

            const invoiceLineObj = {
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: 4
            };

            const response = await request(app)
                .post('/invoiceLine/create')
                .send(invoiceLineObj);

            expect(response.status).toBe(400);
            expect(response.text).toBe('Object received is invalid');
        });
    });

    describe('GET /invoiceLine/getAll/', () => {
        it('should return all invoice lines', async () => {
            // Mock the findAll method of the InvoiceLineService
            const mockInvoiceLines = [{
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: 4
            }, {
                id: 2,
                description: "Pears",
                amount: 456,
                invoiceId: 4
            }];
            invoiceLineService.findAll.mockReturnValue(mockInvoiceLines);

            const response = await request(app)
                .get('/invoiceLine/getAll');

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(mockInvoiceLines);
        });
        it('should return 404 if invoiceLine is not found', async function () {
            invoiceLineService.findAll = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app).get(`/invoiceLine/getAll/`);

            expect(response.status).toBe(404);
        });
    });

    describe('GET /invoiceLine/getOne/:id', () => {
        it('should return the invoice line with the given ID', async () => {
            // Mock the findById method of the InvoiceLineService
            const mockInvoiceLine = {
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: 4
            };
            invoiceLineService.findById.mockReturnValue(mockInvoiceLine);

            const invoiceLineId = 1;

            const response = await request(app)
                .get(`/invoiceLine/getOne/${invoiceLineId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockInvoiceLine);
        });
        it('should return 404 if invoiceLine is not found', async function () {
            const invalidInvoiceLineId = 5;
            invoiceLineService.findById = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app).get(`/invoiceLine/getOne/${invalidInvoiceLineId}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /invoiceLine/updateOne:id', () => {
        it('should update the invoice line with the given ID', async () => {
            // Mock the updateOne method of the InvoiceLineService
            const mockUpdatedInvoiceLine = {
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: 4
            }
            invoiceLineService.updateOne.mockReturnValue(mockUpdatedInvoiceLine);

            const invoiceLineId = 1;
            const updatedInvoiceLineObj = {
                description: "Pears",
                amount: 123,
                invoiceId: 4
            }

            const response = await request(app)
                .put(`/invoiceLine/updateOne/${invoiceLineId}`)
                .send(updatedInvoiceLineObj);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedInvoiceLine);
        });

        it('should return 400 if object received is null', async () => {
            const invoiceLineId = 1;

            const response = await request(app)
                .put(`/invoiceLine/updateOne/${invoiceLineId}`)
                .send(null);

            expect(response.status).toBe(400);
        });

        it('should return 400 if object received is invalid', async () => {
            // Mock the updateOne method of the InvoiceLineService to throw an error
            invoiceLineService.updateOne.mockImplementation(
                () => {throw new Error('Invalid object')});

            const invoiceLineId = 1;
            const updatedInvoiceLineObj = {
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: -56
            }

            const response = await request(app)
                .put(`/invoiceLine/updateOne/${invoiceLineId}`)
                .send(updatedInvoiceLineObj);

            expect(response.status).toBe(400);
            expect(response.text).toEqual('Object received is invalid');
        });
        it('should return 404 if invoiceLine is not found', async function () {
            const invalidInvoiceLineId = 5;
            const updatedInvoiceLineObj = {
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: -56
            }
            invoiceLineService.deleteById = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app)
                .put(`/invoiceLine/deleteOne/${invalidInvoiceLineId}`)
                .send(updatedInvoiceLineObj);

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /invoiceLine/deleteOne/:id', () => {
        it('should delete the invoice line with the given ID', async () => {
            // Mock the deleteById method of the InvoiceLineService
            const mockDeletedInvoiceLine = {
                id: 1,
                description: "Apples",
                amount: 123,
                invoiceId: 123
            }
            invoiceLineService.deleteById.mockReturnValue(mockDeletedInvoiceLine);

            const invoiceLineId = 1;

            const response = await request(app)
                .delete(`/invoiceLine/deleteOne/${invoiceLineId}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(mockDeletedInvoiceLine);
        });

        it('should return 404 if ID is null or negative', async () => {
            const invalidInvoiceLineId = -1;

            const response = await request(app)
                .delete(`/invoiceLine/deleteOne/${invalidInvoiceLineId}`);

            expect(response.status).toBe(404);
        });
        it('should return 404 if invoiceLine is not found', async function () {
            const invalidInvoiceLineId = 5;
            invoiceLineService.deleteById = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app).delete(`/invoiceLine/deleteOne/${invalidInvoiceLineId}`);

            expect(response.status).toBe(404);
        });
    });
});

