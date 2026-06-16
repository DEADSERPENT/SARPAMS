const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rescuer = sequelize.define('Rescuer', {
  rescuer_id: {
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
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  zone_area: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  certification_level: {
    type: DataTypes.ENUM('Basic', 'Intermediate', 'Advanced'),
    allowNull: false
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  join_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'rescuer',
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Rescuer;
