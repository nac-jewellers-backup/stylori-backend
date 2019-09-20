'use strict';
module.exports = (sequelize, DataTypes) => {
  const pricing_sku_metals = sequelize.define('pricing_sku_metals', {
    material_name: DataTypes.STRING,
    product_sku: DataTypes.STRING,
    cost_price: DataTypes.DOUBLE,
    selling_price: DataTypes.DOUBLE,
    markup: DataTypes.DOUBLE,
    margin_percentage: DataTypes.DOUBLE
  }, {});
  pricing_sku_metals.associate = function(models) {
    // associations can be defined here
  };
  return pricing_sku_metals;
};