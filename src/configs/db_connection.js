const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres', // Specify the database dialect
    logging: false, // Disable logging
});

module.exports = sequelize;
