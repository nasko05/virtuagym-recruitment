class MembershipController {
    constructor() {
        this.membershipService = require('../services/MembershipService')
    }

    async createOne(req, res) {
        if (Object.keys(req.body).length === 0) {
            res
                .status(400)
                .end()
        } else {
            try {
                let membershipObj = req.body
                res
                    .status(200)
                    .json(await this.membershipService.createOne(membershipObj))
            } catch (err) {
                res
                    .status(400)
                    .end()
            }
        }
    }

    async findAll(req, res) {
        try {
            res
                .status(200)
                .json(await this.membershipService.findAll())
        } catch (err) {
            res
                .status(404)
                .end()
        }
    }

    async findById(req, res) {
            try {
                let id = req.params.id
                res
                    .status(200)
                    .json(await this.membershipService.findById(id))
            } catch (err) {
                res
                    .status(404)
                    .end()
            }
    }

    async updateOne(req, res) {
        if (Object.keys(req.body).length === 0) {
            res
                .status(400)
                .end()
        } else {
            try {
                let id = req.params.id
                let updatedInvoiceObj = req.body
                res
                    .status(200)
                    .json(await this.membershipService.updateOne(id, updatedInvoiceObj))
            } catch (err) {
                res
                    .status(404)
                    .end()
            }
        }
    }

    async deleteById(req, res) {
        let id = req.params.id
        if (id === null || id < 0) {
            res
                .status(404)
                .end()
        } else {
            try {
                res
                    .status(200)
                    .json(await this.membershipService.deleteById(id))
            } catch (err) {
                res
                    .status(404)
                    .end()
            }

        }
    }
}

module.exports = new MembershipController()
