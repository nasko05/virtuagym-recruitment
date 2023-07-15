const {DataTypes} = require("sequelize")
const sequelize = require('../configs/db_connection')
const User = require("./UserModel");

const Invoice = sequelize.define('invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: DataTypes.DATE,
    status: DataTypes.STRING,
    description: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',

        },
        onDelete: 'CASCADE', // Cascading delete behavior
        onUpdate: 'CASCADE', // Cascading update behavior
    }
}, {
    timestamps: false // disable timestamps
})

module.exports = Invoice
