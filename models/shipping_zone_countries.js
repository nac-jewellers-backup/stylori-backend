'use strict';
module.exports = (sequelize, DataTypes) => {
  const shipping_zone_countries = sequelize.define('shipping_zone_countries', {
    country_id: DataTypes.INTEGER,
    zone_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {});
  shipping_zone_countries.associate = function(models) {
    // associations can be defined here
  };
  return shipping_zone_countries;
};