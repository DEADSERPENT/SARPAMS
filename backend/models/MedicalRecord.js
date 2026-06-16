const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  record_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'animal', key: 'animal_id' }
  },
  vet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'veterinarian', key: 'vet_id' }
  },
  exam_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medication: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  next_checkup_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'medical_record',
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = MedicalRecord;
