const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Adoption = sequelize.define('Adoption', {
  adoption_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'animal', key: 'animal_id' }
  },
  applicant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'adoption_applicant', key: 'applicant_id' }
  },
  officer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'rescuer', key: 'rescuer_id' }
  },
  application_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  approval_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  adoption_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  agreement_signed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'adoption',
  underscored: false,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = Adoption;
