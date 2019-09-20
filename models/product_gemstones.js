'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_gemstones = sequelize.define('product_gemstones', {
    gemstone_type: DataTypes.INTEGER,
    gemstone_shape: DataTypes.STRING,
    gemstone_setting: DataTypes.STRING,
    gemstone_size: DataTypes.STRING,
    stone_count: DataTypes.INTEGER,
    stone_weight: DataTypes.DOUBLE,
    product_sku: DataTypes.STRING
  }, {timestamps: false});
  product_gemstones.associate = function(models) {
    // associations can be defined here
  };
  return product_gemstones;
};