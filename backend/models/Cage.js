const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cage = sequelize.define('Cage', {
  cage_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  shelter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'shelter', key: 'shelter_id' }
  },
  cage_number: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  size_category: {
    type: DataTypes.ENUM('Small', 'Medium', 'Large'),
    allowNull: false
  },
  is_occupied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cage',
  underscored: false,
  timestamps: false
});

module.exports = Cage;
