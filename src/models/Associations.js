const Membership = require("./MembershipModel")
const sequelize = require("../configs/db_connection")
const User = require("./UserModel")
const Invoice = require("./InvoiceModel")
const InvoiceLine = require("./InvoiceLineModel")

async function syncDatabase() {
    Membership.belongsTo(User, {foreignKey: 'userId'})
    User.hasMany(Membership, {foreignKey: 'userId'})
    User.hasMany(Invoice, {foreignKey: 'userId'})
    Invoice.belongsTo(User, {foreignKey: 'userId'})
    InvoiceLine.belongsTo(Invoice, {foreignKey: 'invoiceId'})
    Invoice.hasMany(InvoiceLine, {foreignKey: 'invoiceId'})

    await sequelize.sync().then(() => {
        console.log('Database synced successfully')
    }).catch(() => {
        console.log('Unable to sync database')
    })
}
module.exports = syncDatabase
