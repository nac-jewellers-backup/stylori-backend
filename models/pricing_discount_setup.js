'use strict';
module.exports = (sequelize, DataTypes) => {
  const pricing_discount_setup = sequelize.define('pricing_discount_setup', {
    material: DataTypes.STRING,
    discount_type: DataTypes.INTEGER,
    selling_price_min: DataTypes.DOUBLE,
    selling_price_max: DataTypes.DOUBLE,
    discount_value: DataTypes.DOUBLE
  }, {});
  pricing_discount_setup.associate = function(models) {
    // associations can be defined here
  };
  return pricing_discount_setup;
};