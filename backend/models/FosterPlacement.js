const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FosterPlacement = sequelize.define('FosterPlacement', {
  placement_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'animal', key: 'animal_id' }
  },
  foster_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'foster_family', key: 'foster_id' }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expected_end: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  actual_end: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  outcome: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'foster_placement',
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = FosterPlacement;
