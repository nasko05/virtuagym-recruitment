class InvoiceLineController {
    constructor() {
        this.invoiceLineService = require('../services/InvoiceLineService')
    }

    async createOne(req, res) {
        if (Object.keys(req.body).length === 0) {
            res
                .status(400)
                .send("Object received is null")
                .end()
        } else {
            try {
                let invoiceObj = req.body
                res
                    .status(200)
                    .json(await this.invoiceLineService.createOne(invoiceObj))
            } catch (err) {
                res
                    .status(400)
                    .send("Object received is invalid")
                    .end()
            }
        }
    }

    async findAll(req, res) {
        try {
            const data = await this.invoiceLineService.findAll();
            res.status(200).json(data);
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
                .json(await this.invoiceLineService.findById(id))
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
                    .json(await this.invoiceLineService.updateOne(id, updatedInvoiceObj))
            } catch (err) {
                res
                    .status(400)
                    .send("Object received is invalid")
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
                    .json(await this.invoiceLineService.deleteById(id))
            } catch (err) {
                res
                    .status(404)
                    .end()
            }

        }
    }
}

module.exports = new InvoiceLineController()
