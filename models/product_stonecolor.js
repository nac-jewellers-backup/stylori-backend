'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_stonecolor = sequelize.define('product_stonecolor', {
    stonecolor: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_stonecolor.associate = function(models) {
    // associations can be defined here
  };
  return product_stonecolor;
};