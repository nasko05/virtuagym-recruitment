const sequelize = require('../configs/db_connection')
const {DataTypes} = require('sequelize')
const User = require("./UserModel");


const Membership = sequelize.define('membership', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
    },
    credits: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    start_date: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
    end_date: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
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

module.exports = Membership
