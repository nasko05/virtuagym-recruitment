const request = require('supertest');
const app = require('../../app');
const invoiceController = require('../../src/controllers/InvoiceController');
const {describe,
    it,
    expect
} = require('@jest/globals')

describe('InvoiceController', function () {

    describe('POST /invoices', function () {
        it('should create a new invoice', async function () {
            const invoiceObj = {
                date: Date.now(),
                status: 'Void',
                description: 'Invoice 1',
                amount: 100
            };

            // Mock the invoiceService.createOne method
            invoiceController.invoiceService.createOne = jest.fn().mockReturnValue(invoiceObj);

            const response = await request(app)
                .post('/invoice/create/')
                .send(invoiceObj);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(invoiceObj);
        });

        it('should return 400 if request body is empty', async function () {
            const response = await request(app)
                .post('/invoice/create')
                .send();

            expect(response.status).toBe(400);
        });
        it('should return 400 if invoice is invalid corrupted', async function () {
            invoiceController.invoiceService.createOne =
                jest.fn(() => {
                    throw new Error('InvoiceService: Invalid inputs')
                })
            const invalidInvoice = {
                date: Date.now(),
                status: 'BlaBla', //Invalid status
                description: 'Invoice 1',
                amount: 100
            }
            const response = await request(app)
                .post('/invoice/create')
                .send(invalidInvoice);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /invoices', function () {
        it('should get all invoices', async function () {
            const invoices = [
                {
                    id : 1,
                    date: Date.now(),
                    status: 'Void',
                    description: 'Invoice 1',
                    amount: 100
                },
                {
                    id: 2,
                    date: Date.now() + 50,
                    status: 'Outstanding',
                    description: 'Invoice 2',
                    amount: 200
                }
            ];

            // Mock the invoiceService.findAll method
            invoiceController.invoiceService.findAll = jest.fn().mockReturnValue(invoices);

            const response = await request(app)
                .get('/invoice/getAll/')

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(invoices);
        });
        it('should return 404 if no invoices are found', async function () {
            // Mock the invoiceService.findById method
            invoiceController.invoiceService.findAll = jest.fn(() => {
                throw new Error()
            });

            const response = await request(app).get(`/invoice/getAll/`);

            expect(response.status).toBe(404);
        });
    });

    describe('GET /invoices/:id', function () {
        it('should get a specific invoice by ID', async function () {
            const invoiceObj = {
                id: 1,
                date: Date.now() + 50,
                status: 'Outstanding',
                description: 'Invoice 2',
                amount: 200
            };
            const invoiceId = 1;

            // Mock the invoiceService.findById method
            invoiceController.invoiceService.findById = jest.fn().mockReturnValue(invoiceObj);

            const response = await request(app).get(`/invoice/getOne/${invoiceId}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(invoiceObj);
        });
        it('should return 404 if no invoice is found', async function () {
            // Mock the invoiceService.findById method
            invoiceController.invoiceService.findById = jest.fn(() => {
                throw new Error()
            });

            const response = await request(app).get(`/invoice/getOne/458`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /invoices/:id', function () {
        it('should update a specific invoice by ID', async function () {
            const updatedInvoiceObj  = {
                id: 1,
                date: Date.now() + 50,
                status: 'Outstanding',
                description: 'Invoice 2',
                amount: 200
            };
            const invoiceId = 1;

            // Mock the invoiceService.updateOne method
            invoiceController.invoiceService.updateOne = jest.fn().mockResolvedValue(updatedInvoiceObj);

            const response = await request(app)
                .put(`/invoice/updateOne/${invoiceId}`)
                .send(updatedInvoiceObj);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedInvoiceObj);
        });

        it('should return 400 if request body is empty', async function () {
            const invoiceId = 123;

            const response = await request(app)
                .put(`/invoice/updateOne/${invoiceId}`)
                .send();

            expect(response.status).toBe(400);
        });
        it('should return 404 if invoice is not found', async function () {
            const updatedInvoiceObj  = {
                id: 1,
                date: Date.now() + 50,
                status: 'Outstanding',
                description: 'Invoice 2',
                amount: 200
            };
            invoiceController.invoiceService.updateOne = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app)
                .put(`/invoice/updateOne/${updatedInvoiceObj.id}`)
                .send(updatedInvoiceObj);

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /invoices/:id', function () {
        it('should delete a specific invoice by ID', async function ()
        {
            const deletedInvoiceObj = {
                id: 1,
                date: Date.now() + 50,
                status: 'Outstanding',
                description: 'Invoice 2',
                amount: 200
            };
            const invoiceId = 1;

            // Mock the invoiceService.deleteById method
            invoiceController.invoiceService.deleteById = jest.fn().mockResolvedValue(deletedInvoiceObj);

            const response = await request(app).delete(`/invoice/deleteOne/${invoiceId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(deletedInvoiceObj);
        });
        it('should return 404 if invoice ID is invalid', async function () {
            const invalidInvoiceId = -999;

            const response = await request(app).delete(`/invoice/deleteOne/${invalidInvoiceId}`);

            expect(response.status).toBe(404);
        });
        it('should return 404 if invoice is not found', async function () {
            const invalidInvoiceId = 5;
            invoiceController.invoiceService.deleteById = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app).delete(`/invoice/deleteOne/${invalidInvoiceId}`);

            expect(response.status).toBe(404);
        });
    });
});







