'use strict';
module.exports = (sequelize, DataTypes) => {
  const orders = sequelize.define('orders', {
    cart_id: DataTypes.UUID,
    user_profile_id: DataTypes.UUID,
    payment_mode: DataTypes.INTEGER,
    payment_status: DataTypes.INTEGER,
    order_status: DataTypes.INTEGER
  }, {});
  orders.associate = function(models) {
    // associations can be defined here
  };
  return orders;
};