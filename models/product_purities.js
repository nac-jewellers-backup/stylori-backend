'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_purities = sequelize.define('product_purities', {
    purity: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_purities.associate = function(models) {
    // associations can be defined here
  };
  return product_purities;
};