const {describe, expect, it} = require('@jest/globals');
const membershipRepository = require('../../src/repository/MembershipRepository.js');
const User = require('../../src/models/UserModel.js')
const Membership = require('../../src/models/MembershipModel.js')

jest.mock('../../src/models/MembershipModel.js');
jest.mock('../../src/models/UserModel.js');
const date = Date.now()
const inputMembership = {
    status: "Canceled",
    credits: 2,
    start_date: date,
    end_date: date + 40,
    userId: 3
};
const expectedMembership = {
    id: 2,
    status: "Active",
    credits: 6,
    start_date: date,
    end_date: date + 40,
    userId: 3
};
const oldMembership = {
    id: 2,
    status: "Canceled",
    credits: 2,
    start_date: date,
    end_date: date + 40,
    userId: 3
}
const sampleUser = {
    id: 3
}
describe('MembershipRepository tests', function () {
    describe('CreateOne tests', function () {
        describe('Non existing user', function () {
            it('should throw new Error', async function () {
                User.findByPk.mockReturnValue(null)
                await expect(membershipRepository.createOne(inputMembership))
                    .rejects.toThrow(new Error('MembershipRepository: Could not find membership with id : 3'))
            });
        });
        describe('Successful persistence in database', function () {
            it('should return saved Membership', async function (){
                User.findByPk.mockReturnValue(sampleUser)
                Membership.create.mockReturnValue(oldMembership)
                let res = await membershipRepository.createOne(inputMembership)
                expect(res.id).toBe(2)
                expect(res.status).toBe("Canceled")
                expect(res.credits).toBe(2)
                expect(res.start_date).toBe(date)
                expect(res.end_date).toBe(date + 40)
                expect(res.userId).toBe(3)
            });
        });
        describe('Database could not save', function () {
            it('should throw new Error', async function () {
                User.findByPk.mockReturnValue(sampleUser)
                Membership.create.mockImplementation(function () {
                    throw new Error()
                })
                await expect(membershipRepository.createOne(inputMembership))
                    .rejects.toThrow(new Error(`MembershipRepository: Could not create membership : ${inputMembership}`))

            });
        })
    });
    describe('FindAll tests',  function () {
        describe('No memberships found', function () {
            it('should throw new Error', async function (){
                Membership.findAll.mockReturnValue(null)
                await expect(membershipRepository.findAll())
                    .rejects.toThrow(new Error('MembershipRepository: Could not find memberships'))
            });
        });
        describe('Memberships found',  function () {
            it("should return array of memberships", async function () {
                Membership.findAll.mockReturnValue([expectedMembership])
                await expect(membershipRepository.findAll())
                    .resolves.toStrictEqual([expectedMembership])
            });
        });
    });
    describe('FindById tests',  function () {
        describe('No membership found', function () {
            it('should throw new Error', async function () {
                Membership.findByPk.mockReturnValue(null)
                await expect(membershipRepository.findById(4))
                    .rejects.toThrow(new Error('MembershipRepository: Could not find membership with id : 4'))
            });
        });
        describe('Membership found',  function () {
            it("should return membership", async function () {
                Membership.findByPk.mockReturnValue(expectedMembership)
                await expect(membershipRepository.findById(2))
                    .resolves.toStrictEqual(expectedMembership)
            });
        });
    });
    describe('FindUserById', function () {
        it('should return valid user if found', async function () {
            const exampleUser = {
                id: 1,
                name: "Name",
                email: "Email",
                phone: "12345678"
            }
            Membership.findOne.mockReturnValue(exampleUser);
            await expect(membershipRepository.findByUserId(1)).resolves.toStrictEqual(exampleUser)
        });
        it('should throw new Error if user is not found', async function () {

            Membership.findOne.mockReturnValue(null);
            await expect(membershipRepository.findByUserId(1))
                .rejects.toThrow(new Error(`MembershipRepository: Could not find user with id: 1`))
        });
    });
    describe('UpdateOne tests', function () {
        describe('Nonexistent membership', function () {
            it('should throw new Error', async function () {
                Membership.findByPk.mockReturnValue(null)
                await expect(membershipRepository.updateOne(4, inputMembership))
                    .rejects.toThrow(new Error('MembershipRepository: Could not update membership with id : 4. Nonexistent Membership'))
            });
        });
        describe('Nonexistent invoice', function () {
            it('should throw new Error', async function () {
                Membership.findByPk.mockReturnValue(oldMembership)
                User.findByPk.mockReturnValue(null)
                await expect(membershipRepository.updateOne(2, inputMembership))
                    .rejects.toThrow(new Error('MembershipRepository: Could not update membership with id : 2. Nonexistent User'))
            });
        });
        describe('Zero updated rows', function () {
            it('should return updated invoiceLine', async function () {
                Membership.findByPk.mockReturnValue(oldMembership)
                User.findByPk.mockReturnValue(sampleUser)
                Membership.update.mockReturnValue([0,[expectedMembership]])
                await expect(membershipRepository.updateOne(2, oldMembership))
                    .rejects.toThrow(new Error(`MembershipRepository: Could not update membership
                         with id : 2
                         membership : ${oldMembership}`))
            });
        });
        describe('Correct input info', function () {
            it('should return updated membership', async function () {
                Membership.findByPk.mockReturnValue(oldMembership)
                User.findByPk.mockReturnValue(sampleUser)
                Membership.update.mockReturnValue([1,[expectedMembership]])
                let updated = await membershipRepository.updateOne(2, inputMembership)
                expect(updated.id).toBe(2)
                expect(updated.status).toBe("Active")
                expect(updated.credits).toBe(6)
                expect(updated.start_date).toBe(date)
                expect(updated.end_date).toBe(date + 40)
                expect(updated.userId).toBe(3)

            });
        });
    });
    describe('DeleteById tests', function () {
        describe('Nonexistent membership', function () {
            it('should throw new Error', async function () {
                Membership.findByPk.mockReturnValue(null)
                await expect(membershipRepository.deleteById(10))
                    .rejects.toThrow(new Error('MembershipRepository: Could not delete membership with id : 10'))
            });
        });
        describe('Found target membership', function () {
            it('should delete and return it', async function () {
                Membership.findByPk.mockReturnValue(expectedMembership)
                let deleted = await membershipRepository.deleteById(2)
                expect(deleted.id).toBe(2)
                expect(deleted.status).toBe("Active")
                expect(deleted.credits).toBe(6)
                expect(deleted.start_date).toBe(date)
                expect(deleted.end_date).toBe(date + 40)
                expect(deleted.userId).toBe(3)
            });
        });
    });
});