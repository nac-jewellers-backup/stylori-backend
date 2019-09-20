'use strict';
const uuidv1 = require('uuid/v1');
module.exports = (sequelize, DataTypes) => {
  const gold_price_settings = sequelize.define('gold_price_settings', {
    id:
    { 
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: uuidv1()

    },
    material: DataTypes.STRING,
    purity: DataTypes.INTEGER,
    cost_price: DataTypes.DOUBLE,
    selling_price_percentage: DataTypes.DOUBLE,
    vendor_code: DataTypes.STRING,
  }, {
    timestamps: false,
    freezeTableName: true
  });
  gold_price_settings.associate = function(models) {
    // associations can be defined here
  };
  return gold_price_settings;
};