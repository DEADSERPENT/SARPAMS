const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Animal = sequelize.define('Animal', {
  animal_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  species: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  age_years: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true
  },
  sex: {
    type: DataTypes.ENUM('M', 'F', 'U'),
    allowNull: true
  },
  colour: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  weight_kg: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  microchip_no: {
    type: DataTypes.STRING(25),
    allowNull: true,
    unique: true
  },
  intake_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  health_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Unknown'
  },
  is_vaccinated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_neutered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cage_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'cage', key: 'cage_id' }
  }
}, {
  tableName: 'animal',
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Animal;
