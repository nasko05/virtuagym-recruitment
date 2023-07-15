const {describe, expect, it} = require('@jest/globals');
const userRepository = require('../../src/repository/UserRepository.js');
const User = require('../../src/models/UserModel.js')

jest.mock('../../src/models/UserModel.js');
const inputUser = {

};
const expectedUser = {
    id: 2
};
const oldUser = {
    id: 2
}
describe('UserRepository tests', () => {
    describe('CreateOne tests', () => {
        describe('Successful persistence in database', () => {
            it('should return saved UserLine', async function (){
                User.create.mockReturnValue(expectedUser)
                let res = await userRepository.createOne(inputUser)
                expect(res.id).toBe(2)
            });
        });
        describe('Database could not save', function () {
            it('should throw new Error', async function () {
                User.create.mockImplementation(function () {
                    throw new Error()
                })
                await expect(userRepository.createOne(inputUser))
                    .rejects.toThrow(new Error(`UserRepository: Could not create user : ${inputUser}`))

            });
        })
    });
    describe('FindAll tests',  () => {
        describe('No user found', () => {
            it('should throw new Error', async function (){
                User.findAll.mockReturnValue(null)
                await expect(userRepository.findAll())
                    .rejects.toThrow(new Error('UserRepository: Could not find user'))
            });
        });
        describe('Users found',  () => {
            it("should return array of user", async function () {
                User.findAll.mockReturnValue([expectedUser])
                await expect(userRepository.findAll())
                    .resolves.toStrictEqual([expectedUser])
            });
        });
    });
    describe('FindById tests',  () => {
        describe('No user found', () => {
            it('should throw new Error', async function () {
                User.findByPk.mockReturnValue(null)
                await expect(userRepository.findById(4))
                    .rejects.toThrow(new Error('UserRepository: Could not find user with id : 4'))
            });
        });
        describe('User found',  () => {
            it("should return user", async function () {
                User.findByPk.mockReturnValue(expectedUser)
                await expect(userRepository.findById(2))
                    .resolves.toStrictEqual(expectedUser)
            });
        });
    });
    describe('UpdateOne tests', () => {
        describe('Nonexistent user', () => {
            it('should throw new Error', async function () {
                User.findByPk.mockReturnValue(null)
                await expect(userRepository.updateOne(4, inputUser))
                    .rejects.toThrow(new Error('UserRepository: Could not update user with id : 4'))
            });
        });
        describe('Zero updated rows', function () {
            it('should return updated invoiceLine', async function () {
                User.findByPk.mockReturnValue(inputUser)
                User.update.mockReturnValue([0,[expectedUser]])
                await expect(userRepository.updateOne(2, inputUser))
                    .rejects.toThrow(new Error(`UserRepository: Could not update user
                         with id : 2
                         user : ${inputUser}`))
            });
        });
        describe('Correct input info', function () {
            it('should return updated user', async function () {
                User.findByPk.mockReturnValue(oldUser)
                User.update.mockReturnValue([1,[expectedUser]])
                let updated = await userRepository.updateOne(2, inputUser)
                expect(updated.id).toBe(2)

            });
        });
    });
    describe('DeleteById tests', function () {
        describe('Nonexistent user', function () {
            it('should throw new Error', async function () {
                User.findByPk.mockReturnValue(null)
                await expect(userRepository.deleteById(10))
                    .rejects.toThrow(new Error('UserRepository: Could not delete user with id : 10'))
            });
        });
        describe('Found target user', function () {
            it('should delete and return it', async function () {
                User.findByPk.mockReturnValue(expectedUser)
                let deleted = await userRepository.deleteById(2)
                expect(deleted.id).toBe(2)
            });
        });
    });
});