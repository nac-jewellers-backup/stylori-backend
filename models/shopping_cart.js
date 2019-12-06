'use strict';
module.exports = (sequelize, DataTypes) => {
  const shopping_cart = sequelize.define('shopping_cart', {
    userprofile_id: DataTypes.STRING,
    gross_amount: DataTypes.DOUBLE,
    tax_amount: DataTypes.DOUBLE,
    net_amount: DataTypes.DOUBLE,
    discount:  DataTypes.DOUBLE,
    discounted_price:  DataTypes.DOUBLE,
    is_active: DataTypes.BOOLEAN
  }, {});
  shopping_cart.associate = function(models) {
    // associations can be defined here
  };
  return shopping_cart;
};