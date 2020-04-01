'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_product_categories = sequelize.define('master_product_categories', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    short_code: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_product_categories.associate = function(models) {
    // associations can be defined here
  };
  return master_product_categories;
};