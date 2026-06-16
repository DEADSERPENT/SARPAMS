const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FosterFamily = sequelize.define('FosterFamily', {
  foster_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  family_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  house_type: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  has_other_pets: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approval_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'foster_family',
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = FosterFamily;
