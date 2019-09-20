'use strict';
module.exports = (sequelize, DataTypes) => {
  const pricing_sku_materials = sequelize.define('pricing_sku_materials', {
    material_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    cost_price: DataTypes.DOUBLE,
    selling_price: DataTypes.DOUBLE,
    markup: DataTypes.DOUBLE,
    margin_percentage: DataTypes.DOUBLE
  }, {});
  pricing_sku_materials.associate = function(models) {
    // associations can be defined here
  };
  return pricing_sku_materials;
};