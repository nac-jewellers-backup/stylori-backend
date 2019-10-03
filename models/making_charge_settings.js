'use strict';
const uuidv1 = require('uuid/v1');

module.exports = (sequelize, DataTypes) => {
  const making_charge_settings = sequelize.define('making_charge_settings', {
    id:
    { 
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: uuidv1()

    },
    material: DataTypes.STRING,
    vendor_code: DataTypes.STRING,
    purity: DataTypes.INTEGER,
    weight_start: DataTypes.DOUBLE,
    weight_end: DataTypes.DOUBLE,
    rate_type: DataTypes.INTEGER,
    price_type: DataTypes.INTEGER,
    selling_price_type: DataTypes.INTEGER,
    price: DataTypes.DOUBLE
  }, {
    freezeTableName: true
  });
  making_charge_settings.associate = function(models) {
    // associations can be defined here
  };
  return making_charge_settings;
};