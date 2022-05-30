const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../sequelize');

class Capture extends Model {}

Capture.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },

}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Capture' // We need to choose the model name
});

Capture.sync()

module.exports = Capture;
