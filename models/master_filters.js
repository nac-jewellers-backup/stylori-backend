'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_filters = sequelize.define('master_filters', {
    product_type: DataTypes.STRING,
    filter_type: DataTypes.STRING,
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  master_filters.associate = function(models) {
    // associations can be defined here
  };
  return master_filters;
};