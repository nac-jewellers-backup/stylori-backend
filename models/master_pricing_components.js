'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_pricing_components = sequelize.define('master_pricing_components', {
    name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  master_pricing_components.associate = function(models) {
    // associations can be defined here
  };
  return master_pricing_components;
};