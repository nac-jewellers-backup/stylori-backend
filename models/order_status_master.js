'use strict';
module.exports = (sequelize, DataTypes) => {
  const order_status_master = sequelize.define('order_status_master', {
    name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  order_status_master.associate = function(models) {
    // associations can be defined here
  };
  return order_status_master;
};