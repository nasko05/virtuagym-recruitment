const InvoiceLine = require("../models/InvoiceLineModel");
const Invoice = require('../models/InvoiceModel');
const Membership = require("../models/MembershipModel");
const sequelize = require('../configs/db_connection');

class CheckInRepository {
    async authorize(userId, items) {
        const t = await sequelize.transaction();
        try {
            let membership = await Membership.findOne({
                where: {
                    userId: userId
                },
                transaction: t
            });

            membership.credits -= 1;
            await membership.save({ transaction: t });

            let invoice = await Invoice.findOne({
                where: {
                    userId: userId
                },
                transaction: t
            });

            if (invoice === null) {
                invoice = await Invoice.create({
                    date: Date.now(),
                    status: "Outstanding",
                    description: "New invoice",
                    amount: 1,
                    userId: userId
                }, { transaction: t });

                await sequelize.sync({ transaction: t });
            }

            await InvoiceLine.create({
                description: "New invoiceLine",
                amount: 1,
                invoiceId: invoice.id
            }, { transaction: t });
            for(let i = 0; i < items.length; ++i) {
                let item = items[i]
                let description = item.description;
                let amount = parseInt(item.amount);
                if(isNaN(amount)){
                    throw new Error('Amount could not be parsed to int! Aborting!')
                }
                await InvoiceLine.create({
                    description: description,
                    amount: amount,
                    invoiceId: invoice.id
                }, { transaction: t });
            }
            await t.commit();
            return true
        } catch (e) {
            await t.rollback();
            throw new Error(e.message)
        }
    }
}

module.exports = new CheckInRepository();
