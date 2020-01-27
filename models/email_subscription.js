'use strict';
module.exports = (sequelize, DataTypes) => {
  const email_subscription = sequelize.define('email_subscription', {
    email: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  email_subscription.associate = function(models) {
    // associations can be defined here
  };
  return email_subscription;
};