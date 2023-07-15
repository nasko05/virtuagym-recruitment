const User = require("../models/UserModel")

class UserRepository {

    async createOne(user) {
        try {
            return await User.create(user)
        } catch (err) {
            throw new Error(`UserRepository: Could not create user : ${user}`)
        }
    }

    async findAll() {
        let res = await User.findAll()
        if(res === null)
            throw new Error('UserRepository: Could not find user')
        return res
    }

    async findById(id) {
        let res = await User.findByPk(id)
        if(res === null)
            throw new Error(`UserRepository: Could not find user with id : ${id}`)
        return res
    }

    async updateOne(id, updatedUser) {
        if(await User.findByPk(id) === null){
            throw new Error(`UserRepository: Could not update user with id : ${id}`)
        }
        const [rowsUpdated, [updatedRows]] = await User.update(updatedUser, {
            returning: true,
            where: {id},
        })
        if (rowsUpdated !== 1) {
            throw new Error(`UserRepository: Could not update user
                         with id : ${id}
                         user : ${updatedUser}`)
        }
        return updatedRows
    }

    async deleteById(id) {
        if(await User.findByPk(id) === null){
            throw new Error(`UserRepository: Could not delete user with id : ${id}`)
        }
        let rowToBeDeleted = await User.findByPk(id)
        await User.destroy({
            where: {id},
        });
        return rowToBeDeleted
    }
}

module.exports = new UserRepository()
