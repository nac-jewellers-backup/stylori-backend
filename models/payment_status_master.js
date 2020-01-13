'use strict';
module.exports = (sequelize, DataTypes) => {
  const payment_status_master = sequelize.define('payment_status_master', {
    name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  payment_status_master.associate = function(models) {
    // associations can be defined here
  };
  return payment_status_master;
};