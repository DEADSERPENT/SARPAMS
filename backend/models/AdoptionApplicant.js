const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdoptionApplicant = sequelize.define('AdoptionApplicant', {
  applicant_id: {
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
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
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
  occupation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  has_previous_pets: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  living_situation: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'adoption_applicant',
  underscored: false,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = AdoptionApplicant;
