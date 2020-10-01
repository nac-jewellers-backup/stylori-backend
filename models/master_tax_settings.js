'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_tax_settings = sequelize.define('master_tax_settings', {
    hsn_number: DataTypes.STRING,
    tax_name: DataTypes.STRING,
    tax_value: DataTypes.DOUBLE,
    IGST: DataTypes.DOUBLE,
    CGST: DataTypes.DOUBLE,
    SGST: DataTypes.DOUBLE,
    product_attributes: {
      type: DataTypes.ARRAY(DataTypes.TEXT),

    },
    display_attributes : DataTypes.TEXT
  }, {});
  master_tax_settings.associate = function(models) {
    // associations can be defined here
  };
  return master_tax_settings;
};