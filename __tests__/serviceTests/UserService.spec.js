const {describe, expect, it} = require('@jest/globals');
const userService = require('../../src/services/UserService');
const userRepository = require('../../src/repository/UserRepository');

jest.mock('../../src/repository/UserRepository');

describe("UserService Unit tests", function () {
    describe("CreateOne tests", function () {
        describe("User is null", function () {
            it("should throw Error", async function () {
                await expect(userService.createOne(null)).rejects.toThrow(new Error('UserService: invalid input'));
            });
        });
        describe("User received is invalid", function () {
            it('should throw new Error', async function () {
                const invalidName = {
                    name: null,
                    email: "something@something.com",
                    phone: "12345678"
                }
                const emptyName = {
                    name: "",
                    email: "something@something.com",
                    phone: "12345678"
                }
                const invalidEmail = {
                    name: "Something",
                    email: null,
                    phone: "12345678"
                }
                const emptyEmail = {
                    name: "Something",
                    email: "",
                    phone: "12345678"
                }
                const invalidPhone = {
                    name: "Something",
                    email: "something@something.com",
                    phone: null
                }
                const emptyPhone = {
                    name: "Something",
                    email: "something@something.com",
                    phone: ""
                }
                await expect(userService.createOne(invalidName)).rejects.toThrow(new Error('UserService: invalid input'));
                await expect(userService.createOne(emptyName)).rejects.toThrow(new Error('UserService: invalid input'));
                await expect(userService.createOne(invalidEmail)).rejects.toThrow(new Error('UserService: invalid input'));
                await expect(userService.createOne(emptyEmail)).rejects.toThrow(new Error('UserService: invalid input'));
                await expect(userService.createOne(invalidPhone)).rejects.toThrow(new Error('UserService: invalid input'));
                await expect(userService.createOne(emptyPhone)).rejects.toThrow(new Error('UserService: invalid input'));
            });
        })
        describe("User is valid", function () {
            it("should return valid saved User", async function () {
                const expectedUser = {id: 5};
                userRepository.createOne.mockReturnValue(expectedUser);

                await expect(userService.createOne({})).resolves.toStrictEqual(expectedUser);
            });
        });
    });
    describe("FindAll tests", function () {
        describe("No users found", function () {
            it("should throw Error", async function () {
                userRepository.findAll.mockImplementation(function () {
                    throw new Error('UserService: Could not find user');
                });
                await expect(userService.findAll()).rejects.toThrow(new Error('UserService: Could not find user'))
            });
        });
        describe('Found users', function () {
            it("should return them as a array", async function () {
                const expectedUsers = [{
                    id: 5,
                    name: "Something",
                    email: "something@something.com",
                    phone: "12345678"
                }]
                userRepository.findAll.mockImplementation(function () {
                    return expectedUsers
                });
                await expect(userService.findAll()).resolves.toStrictEqual(expectedUsers)
            });
        });
    });
    describe("FindById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(userService.findById(-1)).rejects.toThrow(new Error('UserService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(userService.findById(null)).rejects.toThrow(new Error('UserService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return valid User object", async function () {
                const expectedUser = {
                    id: 4,
                    name: "Something",
                    email: "something@something.com",
                    phone: "12345678"
                }
                userRepository.findById.mockReturnValue(expectedUser)
                await expect(userService.findById(4)).resolves.toStrictEqual(expectedUser)
            });
        });
    });
    describe("UpdateOne tests", function () {
        const expectedUser = {
            id: 4,
            name: "Something",
            email: "something@something.com",
            phone: "12345678"
        }
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(userService.updateOne(-1, {id: 4})).rejects.toThrow(new Error('UserService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(userService.updateOne(null, {id: 4})).rejects.toThrow(new Error('UserService: Id cannot be null or zero'))
            });
        });
        describe("UpdatedUser is null", function () {
            it("should throw Error", async function () {
                await expect(userService.updateOne(4, null)).rejects.toThrow(new Error('UserService: invalid input'))
            });
        });
        describe("Correct id and updatedUser passed", function () {
            it("should return correctly updated User", async function () {
                userRepository.updateOne.mockImplementation(function () {
                    return expectedUser
                });
                await expect(userService.updateOne(4, {id: 4})).resolves.toStrictEqual(expectedUser)
            });
        });
    });
    describe("DeleteById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(userService.deleteById(-1)).rejects.toThrow(new Error('UserService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(userService.deleteById(null)).rejects.toThrow(new Error('UserService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return the deleted user", async function () {
                const expectedUser = {
                    id: 5,
                    name: "Something",
                    email: "something@something.com",
                    phone: "12345678"
                }
                userRepository.deleteById.mockImplementation(function () {
                    return expectedUser
                })
                await expect(userService.deleteById(5)).resolves.toStrictEqual(expectedUser)
            })
        })
    })
});
