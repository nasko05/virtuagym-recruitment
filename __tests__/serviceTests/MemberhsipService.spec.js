const {describe, expect, it} = require('@jest/globals');
const membershipService = require('../../src/services/MembershipService');
const membershipRepository = require('../../src/repository/MembershipRepository.js');
const userRepository = require('../../src/repository/UserRepository.js');
const assert = require("assert");

jest.mock('../../src/repository/MembershipRepository.js');
jest.mock('../../src/repository/UserRepository.js');

const start_date = Date.now()
const end_date = start_date + 45
describe("MembershipService Unit tests", function () {
    describe("CreateOne tests", function () {
        describe("Membership is null", function () {
            it("should throw Error", async function () {
                await expect(membershipService.createOne(null)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership status is invalid", function () {
            it("should throw Error", async function () {
                const statusNull = {
                    status: "BlaBla",
                    credits: 123,
                    start_date: start_date,
                    end_date: end_date
                }
                await expect(membershipService.createOne(statusNull)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership credits amount is null", function () {
            it("should throw Error", async function () {
                const creditsNull = {
                    status: "Active",
                    credits: null,
                    start_date: start_date,
                    end_date: end_date
                }
                await expect(membershipService.createOne(creditsNull)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership credits amount is lower than 0", function () {
            it("should throw Error", async function () {
                const creditsNegative = {
                    status: "Active",
                    credits: -5,
                    start_date: start_date,
                    end_date: end_date
                }
                await expect(membershipService.createOne(creditsNegative)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership start_date is after end_date", function () {
            it("should throw new Error", async function () {
                const swappedDates = {
                    status: "Active",
                    credits: 5,
                    start_date: end_date,
                    end_date: start_date
                }
                await expect(membershipService.createOne(swappedDates)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            })
        })
        describe("Membership is valid", function () {
            it("should return valid saved InvoiceLine", async function () {
                const inputMembership = {
                    status: "Active",
                    credits: 5,
                    start_date: start_date,
                    end_date: end_date,
                    userId: 1
                }
                const expectedMembership = {
                    id: 1,
                    status: "Active",
                    credits: 5,
                    start_date: start_date,
                    end_date: end_date,
                    userId: 1
                }
                const exampleUser = {
                    id: 1,
                    name: "Name",
                    email: "Email",
                    phone: "12345678"
                }
                membershipRepository.createOne.mockReturnValue(expectedMembership);
                userRepository.findById.mockReturnValue(exampleUser);
                const result = await membershipService.createOne(inputMembership)
                expect(result.id).toBe(1)
                expect(result.status).toBe("Active")
                expect(result.credits).toBe(5)
                expect(result.start_date).toBe(start_date)
                expect(result.end_date).toBe(end_date)
                assert(result.start_date < result.end_date)
            });
        });
    });
    describe("FindAll tests", function () {
        describe("No Memberships found", function () {
            it("should throw Error", async function () {
                membershipRepository.findAll.mockImplementation(function () {
                    throw new Error('MembershipRepository: Could not find memberships');
                });
                await expect(membershipService.findAll()).rejects.toThrow(new Error('MembershipRepository: Could not find memberships'))
            });
        });
        describe('Found Memberships', function () {
            it("should return them as a array", async function () {
                const expectedMemberships = [{
                    id: 1,
                    status: "Active",
                    credits: 5,
                    start_date: start_date,
                    end_date: end_date
                }]
                membershipRepository.findAll.mockImplementation(function () {
                    return expectedMemberships
                });
                await expect(membershipService.findAll()).resolves.toBe(expectedMemberships)
            });
        });
    });
    describe("FindById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(membershipService.findById(-1)).rejects.toThrow(new Error('MembershipService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(membershipService.findById(null)).rejects.toThrow(new Error('MembershipService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return valid Membership object", async function () {
                const expectedMembership = {
                    id: 1,
                    status: "Active",
                    credits: 5,
                    start_date: start_date,
                    end_date: end_date
                }
                membershipRepository.findById.mockReturnValue(expectedMembership)
                await expect(membershipService.findById(4)).resolves.toBe(expectedMembership)
            });
        });
    });
    describe("UpdateOne tests", function () {
        const inputMembership = {
            status: "Active",
            credits: 5,
            start_date: start_date,
            end_date: end_date,
            userId: 1
        }
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(membershipService.updateOne(-1, inputMembership)).rejects.toThrow(new Error('MembershipService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(membershipService.updateOne(null, inputMembership)).rejects.toThrow(new Error('MembershipService: Id cannot be null or zero'))
            });
        });
        describe("Membership is null", function () {
            it("should throw Error", async function () {
                await expect(membershipService.updateOne(1, null)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership status is invalid", function () {
            it("should throw Error", async function () {
                const statusNull = {
                    status: "BlaBla2",
                    credits: 123,
                    start_date: start_date,
                    end_date: end_date
                }
                await expect(membershipService.createOne(statusNull)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership credits amount is null", function () {
            it("should throw Error", async function () {
                const creditsNull2 = {
                    status: "Active",
                    credits: null,
                    start_date: start_date,
                    end_date: end_date
                }
                await expect(membershipService.createOne(creditsNull2)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership credits amount is lower than 0", function () {
            it("should throw Error", async function () {
                const creditsNegative = {
                    status: "Active",
                    credits: -6,
                    start_date: start_date,
                    end_date: end_date
                }
                await expect(membershipService.createOne(creditsNegative)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            });
        });
        describe("Membership start_date or end_date is null", function () {
            it("should throw new Error", async function () {
                const invalidDates = {
                    status: "Active",
                    credits: 10,
                    start_date: end_date,
                    end_date: start_date
                }
                invalidDates.start_date = null
                await expect(membershipService.createOne(invalidDates)).rejects.toThrow(new Error('MembershipService: Invalid input'));
                invalidDates.start_date = Date.now()
                invalidDates.end_date = null
                await expect(membershipService.createOne(invalidDates)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            })
        })
        describe("Membership start_date is after end_date", function () {
            it("should throw new Error", async function () {
                const swappedDates = {
                    status: "Active",
                    credits: 10,
                    start_date: end_date,
                    end_date: start_date
                }
                await expect(membershipService.createOne(swappedDates)).rejects.toThrow(new Error('MembershipService: Invalid input'));
            })
        })
        describe("Membership is valid", function () {
            it("should return valid saved Membership", async function () {
                const inputMembership = {
                    status: "Active",
                    credits: 6,
                    start_date: start_date,
                    end_date: end_date,
                    userId: 1
                }
                const updatedMembership = {
                    id: 3,
                    status: "Active",
                    credits: 6,
                    start_date: start_date,
                    end_date: end_date,
                    userId: 1
                }
                membershipRepository.updateOne.mockReturnValue(updatedMembership);
                let result = await membershipService.updateOne(3, inputMembership)
                expect(result.id).toBe(3)
                expect(result.status).toBe("Active")
                expect(result.credits).toBe(6)
                expect(result.start_date).toBe(start_date)
                expect(result.end_date).toBe(end_date)
                assert(result.start_date < result.end_date)
                inputMembership.status = 'Canceled'
                updatedMembership.status = 'Canceled'
                result = await membershipService.updateOne(3, inputMembership)
                expect(result.id).toBe(3)
                expect(result.status).toBe("Canceled")
                expect(result.credits).toBe(6)
                expect(result.start_date).toBe(start_date)
                expect(result.end_date).toBe(end_date)
                assert(result.start_date < result.end_date)
            });
        });
    });
    describe("DeleteById tests", function () {
        describe("Id is less than 0", function () {
            it("should throw Error", async function () {
                await expect(membershipService.deleteById(-1)).rejects.toThrow(new Error('MembershipService: Id cannot be null or zero'))
            });
        });
        describe("Id is null", function () {
            it("should throw Error", async function () {
                await expect(membershipService.deleteById(null)).rejects.toThrow(new Error('MembershipService: Id cannot be null or zero'))
            });
        });
        describe("Id is valid", function () {
            it("should return the deleted InvoiceLine", async function () {
                const expectedMembership = {
                    id: 3,
                    status: "Active",
                    credits: 6,
                    start_date: start_date,
                    end_date: end_date
                }
                membershipRepository.deleteById.mockImplementation(function () {
                    return expectedMembership
                })
                await expect(membershipService.deleteById(5)).resolves.toBe(expectedMembership)
            })
        })
    })
});
