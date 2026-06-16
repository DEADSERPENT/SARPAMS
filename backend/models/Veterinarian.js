const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Veterinarian = sequelize.define('Veterinarian', {
  vet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  specialisation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  license_no: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'veterinarian',
  underscored: false,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = Veterinarian;
