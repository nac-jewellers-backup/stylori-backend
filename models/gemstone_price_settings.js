'use strict';
const uuidv1 = require('uuid/v1');
module.exports = (sequelize, DataTypes) => {
  const gemstone_price_settings = sequelize.define('gemstone_price_settings', {
    id:
    { 
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: uuidv1()

    },
    gemstone_type: DataTypes.STRING,
    vendor_code: DataTypes.STRING,
    weight_start: DataTypes.DOUBLE,
    weight_end: DataTypes.DOUBLE,
    cost_price: DataTypes.DOUBLE,
    selling_price: DataTypes.DOUBLE,
    selling_price_type: DataTypes.INTEGER
  }, {
    freezeTableName: true
  });
  gemstone_price_settings.associate = function(models) {
    // associations can be defined here
  };
  return gemstone_price_settings;
};