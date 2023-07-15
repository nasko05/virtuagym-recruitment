const {DataTypes} = require("sequelize")
const sequelize = require('../configs/db_connection')


const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        default: ""
    },
    email: {
        type: DataTypes.STRING,
        default: ""
    },
    phone: {
        type: DataTypes.STRING,
        default: ""
    }
}, {
    timestamps: false // disable timestamps
})
module.exports = User
