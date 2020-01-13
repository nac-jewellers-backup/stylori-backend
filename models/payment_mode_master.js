'use strict';
module.exports = (sequelize, DataTypes) => {
  const payment_mode_master = sequelize.define('payment_mode_master', {
    modename: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  payment_mode_master.associate = function(models) {
    // associations can be defined here
  };
  return payment_mode_master;
};