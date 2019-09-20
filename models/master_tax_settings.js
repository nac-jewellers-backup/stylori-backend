'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_tax_settings = sequelize.define('master_tax_settings', {
    product_type: DataTypes.STRING,
    tax_name: DataTypes.STRING,
    tax_value: DataTypes.DOUBLE
  }, {});
  master_tax_settings.associate = function(models) {
    // associations can be defined here
  };
  return master_tax_settings;
};