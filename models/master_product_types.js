'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_product_types = sequelize.define('master_product_types', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    short_code: DataTypes.STRING,
    certificate: DataTypes.TEXT,
    display_order: DataTypes.INTEGER,
    is_filter: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN
  }, {});
  master_product_types.associate = function(models) {
    // associations can be defined here
  };
  return master_product_types;
};