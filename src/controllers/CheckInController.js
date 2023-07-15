class CheckInController {
    constructor() {
        this.checkInService = require('../services/CheckInService')
        this.checkInService.authorize.bind(this.checkInService)
    }
    async authorize(req, res) {
        let userId = req.params.userId
        if(userId === null
            || userId < 0
            || Object.keys(req.body).length === 0){
            res
                .status(404)
                .send("Invalid userId")
        }
        try {

            await this.checkInService.authorize(userId, req.body.items);
            res.status(200).send('Successful checkIn')
        } catch (e) {
            console.log(e)
            res
                .status(404)
                .end()
        }
    }
}
module.exports = new CheckInController()