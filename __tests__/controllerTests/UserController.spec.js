const request = require('supertest');
const app = require('../../app');
const userController = require('../../src/controllers/UserController');
const {describe,
    it,
    expect
} = require('@jest/globals')

describe('UserController', function () {

    describe('POST /user', function () {
        it('should create a new user', async function () {
            const userObj = {
                id: 5,
                name: "Something",
                email: "something@something.com",
                phone: "12345678"
            };

            // Mock the userService.createOne method
            userController.userService.createOne = jest.fn().mockReturnValue(userObj);

            const response = await request(app)
                .post('/user/create/')
                .send(userObj);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toEqual(userObj);
        });

        it('should return 400 if request body is empty', async function () {
            const response = await request(app)
                .post('/user/create')
                .send();

            expect(response.status).toStrictEqual(400);
        });
        it('should return 400 if user is invalid corrupted', async function () {
            userController.userService.createOne =
                jest.fn(() => {
                    throw new Error('UserService: Invalid inputs')
                })
            const invalidUser = {
                id: 5,
                name: "",
                email: "something@something.com",
                phone: "12345678"
            }
            const response = await request(app)
                .post('/user/create')
                .send(invalidUser);

            expect(response.status).toStrictEqual(400);
        });
    });

    describe('GET /user', function () {
        it('should get all user', async function () {
            const user = [
                {
                    id: 5,
                    name: "Something",
                    email: "something@something.com",
                    phone: "12345678"
                },
                {
                    id: 5,
                    name: "Something2",
                    email: "something2@something.com",
                    phone: "12345689"
                }
            ];

            // Mock the userService.findAll method
            userController.userService.findAll = jest.fn().mockReturnValue(user);

            const response = await request(app)
                .get('/user/getAll/')

            expect(response.status).toStrictEqual(200);
            expect(response.body).toStrictEqual(user);
        });
        it('should return 404 if no user are found', async function () {
            // Mock the userService.findById method
            userController.userService.findAll = jest.fn(() => {
                throw new Error()
            });

            const response = await request(app).get(`/user/getAll/`);

            expect(response.status).toStrictEqual(404);
        });
    });

    describe('GET /user/:id', function () {
        it('should get a specific user by ID', async function () {
            const userObj = {
                id: 5,
                name: "Something",
                email: "something@something.com",
                phone: "12345678"
            };
            const userId = 1;

            // Mock the userService.findById method
            userController.userService.findById = jest.fn().mockReturnValue(userObj);

            const response = await request(app).get(`/user/getOne/${userId}`);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toStrictEqual(userObj);
        });
        it('should return 404 if no user is found', async function () {
            // Mock the userService.findById method
            userController.userService.findById = jest.fn(() => {
                throw new Error()
            });

            const response = await request(app).get(`/user/getOne/458`);

            expect(response.status).toStrictEqual(404);
        });
    });

    describe('PUT /user/:id', function () {
        it('should update a specific user by ID', async function () {
            const updatedUserObj  = {
                id: 5,
                name: "Something",
                email: "something@something.com",
                phone: "12345678"
            };
            const userId = 1;

            // Mock the userService.updateOne method
            userController.userService.updateOne = jest.fn().mockResolvedValue(updatedUserObj);

            const response = await request(app)
                .put(`/user/updateOne/${userId}`)
                .send(updatedUserObj);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toEqual(updatedUserObj);
        });

        it('should return 400 if request body is empty', async function () {
            const userId = 123;

            const response = await request(app)
                .put(`/user/updateOne/${userId}`)
                .send();

            expect(response.status).toStrictEqual(400);
        });
        it('should return 404 if user is not found', async function () {
            const updatedUserObj  = {
                id: 5,
                name: "Something",
                email: "something@something.com",
                phone: "12345678"
            };
            userController.userService.updateOne = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app)
                .put(`/user/updateOne/${updatedUserObj.id}`)
                .send(updatedUserObj);

            expect(response.status).toStrictEqual(404);
        });
    });

    describe('DELETE /user/:id', function () {
        it('should delete a specific user by ID', async function ()
        {
            const deletedUserObj = {
                id: 5,
                name: "Something",
                email: "something@something.com",
                phone: "12345678"
            };
            const userId = 1;

            // Mock the userService.deleteById method
            userController.userService.deleteById = jest.fn().mockResolvedValue(deletedUserObj);

            const response = await request(app).delete(`/user/deleteOne/${userId}`);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toEqual(deletedUserObj);
        });
        it('should return 404 if user ID is invalid', async function () {
            const invalidUserId = -999;

            const response = await request(app).delete(`/user/deleteOne/${invalidUserId}`);

            expect(response.status).toStrictEqual(404);
        });
        it('should return 404 if user is not found', async function () {
            const invalidUserId = 5;
            userController.userService.deleteById = jest.fn(function () {
                throw new Error()
            })
            const response = await request(app).delete(`/user/deleteOne/${invalidUserId}`);

            expect(response.status).toStrictEqual(404);
        });
    });
});







