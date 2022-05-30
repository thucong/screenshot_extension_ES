const { Sequelize } = require("sequelize");

const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USERNAME,
    process.env.PASSWORD,
    {
      host: "127.0.0.1",
      port: 3306,
      dialect: "mysql",
    }
  );

module.exports = sequelize;