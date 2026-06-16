const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shelter = sequelize.define('Shelter', {
  shelter_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  shelter_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contact_phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  manager_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'shelter',
  underscored: false,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = Shelter;
