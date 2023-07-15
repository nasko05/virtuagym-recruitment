const request = require('supertest');
const app = require('../../app');
const membershipController = require('../../src/controllers/MembershipController');
const {describe,
    it,
    expect
} = require('@jest/globals')

describe('MembershipController', function () {
    describe('POST /memberships', function () {
        it('should create a new membership', async function () {
            const membershipObj = {
                status: 'Active',
                credits: 123,
                start_year: Date.now(),
                end_date: Date.now() + 40,
                userId: 1
            };

            // Mock the membershipService.createOne method
            membershipController.membershipService.createOne = jest.fn().mockReturnValue(membershipObj);

            const response = await request(app)
                .post('/membership/create/')
                .send(membershipObj);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(membershipObj);
        });

        it('should return 500 if request body is empty', async function () {
            const response = await request(app)
                .post('/membership/create')
                .send();

            expect(response.status).toBe(400);
        });
        it('should return 400 if membership is invalid corrupted', async function () {
            membershipController.membershipService.createOne =
                jest.fn(() => {
                    throw new Error('MembershipService: Invalid inputs')
                })
            const invalidMembership = {
                status: 'Active',
                credits: 123,
                start_year: Date.now(),
                end_date: Date.now() + 40,
                userId: -56 //Invalid userId
            }
            const response = await request(app)
                .post('/membership/create')
                .send(invalidMembership);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /memberships', function () {
        it('should get all memberships', async function () {
            const memberships = [
                {
                    id : 1,
                    status: 'Active',
                    credits: 123,
                    start_year: Date.now(),
                    end_date: Date.now() + 40,
                    userId: 1
                },
                {
                    id: 2,
                    status: 'Active',
                    credits: 456,
                    start_year: Date.now(),
                    end_date: Date.now() + 40,
                    userId: 2
                }
            ];

            // Mock the membershipService.findAll method
            membershipController.membershipService.findAll = jest.fn().mockReturnValue(memberships);

            const response = await request(app)
                .get('/membership/getAll/')

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(memberships);
        });

        it('should return 404 if it cannot find any', async function () {

            // Mock the membershipService.findAll method
            membershipController.membershipService.findAll = jest.fn().mockImplementation(function () {
                throw new Error()
            });

            const response = await request(app)
                .get('/membership/getAll/')

            expect(response.status).toBe(404);
        });
    });

    describe('GET /memberships/getOne/:id', function () {
        it('should get a specific membership by ID', async function () {
            const membershipObj = {
                id: 1,
                status: 'Active',
                credits: 123,
                start_year: Date.now(),
                end_date: Date.now() + 40,
                userId: 1
            };
            const membershipId = 1;

            // Mock the membershipService.findById method
            membershipController.membershipService.findById = jest.fn().mockReturnValue(membershipObj);

            const response = await request(app).get(`/membership/getOne/${membershipId}`);

            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(membershipObj);
        });
        it('should return 404 if no membership is found', async function () {
            // Mock the membershipService.findById method
            membershipController.membershipService.findById = jest.fn(() => {
                throw new Error()
            });

            const response = await request(app).get(`/membership/getOne/458`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /memberships/:id', function () {
        it('should update a specific membership by ID', async function () {
            const updatedMembershipObj  = {
                id: 1,
                status: 'Active',
                credits: 456,
                start_year: Date.now(),
                end_date: Date.now() + 80,
                userId: 1
            };
            const membershipId = 1;

            // Mock the membershipService.updateOne method
            membershipController.membershipService.updateOne = jest.fn().mockResolvedValue(updatedMembershipObj);

            const response = await request(app)
                .put(`/membership/updateOne/${membershipId}`)
                .send(updatedMembershipObj);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedMembershipObj);
        });

        it('should return 400 if request body is empty', async function () {
            const membershipId = 123;

            const response = await request(app)
                .put(`/membership/updateOne/${membershipId}`)
                .send();

            expect(response.status).toBe(400);
        });
        it('should return 404 if it cannot find the object or if there is any other error', async function () {
            const updatedMembershipObj  = {
                id: 1,
                status: 'Active',
                credits: 456,
                start_year: Date.now(),
                end_date: Date.now() + 80,
                userId: 1
            };
            membershipController.membershipService.updateOne = jest.fn().mockImplementation(function () {
                throw new Error()
            });

            const response = await request(app)
                .put(`/membership/updateOne/${updatedMembershipObj.membershipId}`)
                .send(updatedMembershipObj)

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /memberships/:id', function () {
        it('should delete a specific membership by ID', async function ()
        {
            const deletedMembershipObj = {
                id: 1,
                status: 'Active',
                credits: 123,
                start_year: Date.now(),
                end_date: Date.now() + 40,
                userId: 1
            };
            const membershipId = 1;

            // Mock the membershipService.deleteById method
            membershipController.membershipService.deleteById = jest.fn().mockResolvedValue(deletedMembershipObj);

            const response = await request(app).delete(`/membership/deleteOne/${membershipId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(deletedMembershipObj);
        });
        it('should return 404 if membership ID is invalid', async function () {
            const invalidMembershipId = -999;

            const response = await request(app).delete(`/membership/deleteOne/${invalidMembershipId}`);

            expect(response.status).toBe(404);
        });
        it('should return 404 if membership is not found', async function () {
            const invalidMembershipId = 5;
            membershipController.membershipService.deleteById = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app).delete(`/membership/deleteOne/${invalidMembershipId}`);

            expect(response.status).toBe(404);
        });
    });
});







