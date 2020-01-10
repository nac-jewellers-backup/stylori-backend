'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_by_weight = sequelize.define('product_by_weight', {
    weight: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_by_weight.associate = function(models) {
    // associations can be defined here
  };
  return product_by_weight;
};