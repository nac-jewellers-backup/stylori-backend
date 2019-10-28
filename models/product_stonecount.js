'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_stonecount = sequelize.define('product_stonecount', {
    stonecount: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_stonecount.associate = function(models) {
    // associations can be defined here
  };
  return product_stonecount;
};