const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RescueRequest = sequelize.define('RescueRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  report_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  report_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  location_address: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Open', 'Assigned', 'Closed'),
    allowNull: false,
    defaultValue: 'Open'
  },
  citizen_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  citizen_phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  rescuer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'rescuer', key: 'rescuer_id' }
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'animal', key: 'animal_id' }
  }
}, {
  tableName: 'rescue_request',
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = RescueRequest;
