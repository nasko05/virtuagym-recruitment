const {DataTypes} = require("sequelize")
const sequelize = require('../configs/db_connection')
const Invoice = require("./InvoiceModel");

const InvoiceLine = sequelize.define('invoiceLine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    invoiceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Invoice,
            key: 'id',
        },
        onDelete: 'CASCADE', // Cascading delete behavior
        onUpdate: 'CASCADE', // Cascading update behavior
    }
}, {
    timestamps: false // disable timestamps
})

module.exports = InvoiceLine
