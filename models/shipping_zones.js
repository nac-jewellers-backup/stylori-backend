'use strict';
module.exports = (sequelize, DataTypes) => {
  const shipping_zones = sequelize.define('shipping_zones', {
    name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  shipping_zones.associate = function(models) {
    // associations can be defined here
  };
  return shipping_zones;
};