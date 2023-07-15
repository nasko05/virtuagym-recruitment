class UserService {
    constructor() {
        this.userRepository = require('../repository/UserRepository')
    }
    async createOne(user) {
        if(user === null
            || user.name === null
            || user.name === ""
            || user.email === null
            || user.email === ""
            || user.phone === null
            || user.phone === "")
            throw new Error("UserService: invalid input")
        return await this.userRepository.createOne(user)
    }

    async findAll() {
        return await this.userRepository.findAll()
    }

    async findById(id) {
        if(id === null
            || id < 0)
            throw new Error("UserService: Id cannot be null or zero")
        return await this.userRepository.findById(id)
    }

    async updateOne(id, updatedUser) {
        if(id === null
            || id < 0)
            throw new Error("UserService: Id cannot be null or zero")
        if(updatedUser === null
            || updatedUser.name === null
            || updatedUser.name === ""
            || updatedUser.email === null
            || updatedUser.email === ""
            || updatedUser.phone === null
            || updatedUser.phone === "")
            throw new Error("UserService: invalid input")
        return await this.userRepository.updateOne(id, updatedUser)
    }

    async deleteById(id) {
        if(id === null
            || id < 0)
            throw new Error("UserService: Id cannot be null or zero")
        return await this.userRepository.deleteById(id)
    }
}

module.exports = new UserService()