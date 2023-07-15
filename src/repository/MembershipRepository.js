const Membership = require("../models/MembershipModel")
const User = require("../models/UserModel")
class MembershipRepository {

    async createOne(membership) {
        if(await User.findByPk(membership.userId) === null){
            throw new Error(`MembershipRepository: Could not find membership with id : ${membership.userId}`)
        }
        try {
            return await Membership.create(membership)
        } catch (err) {
            throw new Error(`MembershipRepository: Could not create membership : ${membership}`)
        }
    }
    async findByUserId(userId){
        let user =  await Membership.findOne({ "where": { userId } });
        if(user === null)
            throw new Error(`MembershipRepository: Could not find user with id: ${userId}`)
        return user
    }
    async findAll() {
        let res = await Membership.findAll()
        if(res === null)
            throw new Error('MembershipRepository: Could not find memberships')
        return res
    }

    async findById(id) {
        let res = await Membership.findByPk(id)
        if(res === null)
            throw new Error(`MembershipRepository: Could not find membership with id : ${id}`)
        return res
    }

    async updateOne(id, updatedMembership) {
        if(await Membership.findByPk(id) === null){
            throw new Error(`MembershipRepository: Could not update membership with id : ${id}. Nonexistent Membership`)
        }
        if(await User.findByPk(updatedMembership.userId) === null){
            throw new Error(`MembershipRepository: Could not update membership with id : ${id}. Nonexistent User`)
        }
        const [rowsUpdated, [updatedRows]] = await Membership.update(updatedMembership, {
            returning: true,
            where: {id},
        })
        if (rowsUpdated !== 1) {
            throw new Error(`MembershipRepository: Could not update membership
                         with id : ${id}
                         membership : ${updatedMembership}`)
        }
        return updatedRows
    }

    async deleteById(id) {
        if(await Membership.findByPk(id) === null){
            throw new Error(`MembershipRepository: Could not delete membership with id : ${id}`)
        }
        let rowToBeDeleted = await Membership.findByPk(id)
        await Membership.destroy({
            where: {id},
        });
        return rowToBeDeleted
    }
}

module.exports = new MembershipRepository()
