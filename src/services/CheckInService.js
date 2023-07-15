class CheckInService {
    constructor() {
        this.userRepository = require('../repository/UserRepository')
        this.userRepository.findById.bind(this.userRepository)
        this.membershipRepository = require('../repository/MembershipRepository')
        this.checkInRepository = require('../repository/CheckInRepository')
    }
    async authorize(userId, items){
        let membership;
        try {
            await this.userRepository.findById(userId)
        } catch (e) {
            throw new Error(`CheckInService: User with id: ${userId} not found`)
        }
        try {
            membership = await this.membershipRepository.findByUserId(userId);
        } catch (e) {
            throw new Error(`CheckInService: Membership not found`)
        }
        if(membership.status === 'Canceled'){
            throw new Error(`CheckInService: Membership is canceled`)
        } else if(membership.credits <= 0) {
            throw new Error(`CheckInService: Not enough credits`)
        }
        try {
            await this.checkInRepository.authorize(userId, items);
        } catch(e){
            throw new Error(e.message)
        }
    }
}

module.exports = new CheckInService()