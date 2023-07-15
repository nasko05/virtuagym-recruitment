class MembershipService {
    constructor() {
        this.membershipRepository = require('../repository/MembershipRepository')
        this.userRepository = require('../repository/UserRepository')
    }

    async createOne(membership) {
        if(membership === null
            || (
                membership.status !== "Active" && membership.status !== "Canceled"
                )
            || membership.credits === null
            || membership.credits < 0
            || membership.start_date === null
            || membership.end_date === null
            || membership.end_date < membership.start_date
            || await this.userRepository.findById(membership.userId) === null)
            throw new Error("MembershipService: Invalid input")
        return await this.membershipRepository.createOne(membership)
    }

    async findAll() {
        return await this.membershipRepository.findAll()
    }

    async findById(id) {
        if(id === null
            || id < 0)
            throw new Error("MembershipService: Id cannot be null or zero")
        return await this.membershipRepository.findById(id)
    }

    async updateOne(id, updatedMembership) {
        if(id === null
            || id < 0)
            throw new Error("MembershipService: Id cannot be null or zero")
        if(updatedMembership === null
            || (
                updatedMembership.status !== "Active" && updatedMembership.status !== "Canceled"
            )
            || updatedMembership.credits === null
            || updatedMembership.credits < 0
            || updatedMembership.start_date === null
            || updatedMembership.end_date === null
            || updatedMembership.end_date < updatedMembership.start_date
            || await this.userRepository.findById(updatedMembership.userId) === null)
            throw new Error("MembershipService: Invalid input")
        return await this.membershipRepository.updateOne(id, updatedMembership)
    }

    async deleteById(id) {
        if(id === null
            || id < 0)
            throw new Error("MembershipService: Id cannot be null or zero")
        return await this.membershipRepository.deleteById(id)
    }
}

module.exports = new MembershipService()