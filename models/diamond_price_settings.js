'use strict';
const uuidv1 = require('uuid/v1');
module.exports = (sequelize, DataTypes) => {
  const diamond_price_settings = sequelize.define('diamond_price_settings', {
    id:
    { 
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: uuidv1()

    },
    vendor_code: DataTypes.STRING,
    diamond_colour: DataTypes.STRING,
    diamond_clarity: DataTypes.STRING,
    cost_price: DataTypes.DOUBLE,
    selling_price_type: DataTypes.INTEGER,
    selling_price: DataTypes.DOUBLE
  },{
    timestamps: false,
    freezeTableName: true
  });
  diamond_price_settings.associate = function(models) {
    // associations can be defined here
  };
  return diamond_price_settings;
};