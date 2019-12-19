'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_address = sequelize.define('user_address', {
    userprofile_id: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    pincode: DataTypes.STRING,
    addressline1: DataTypes.STRING,
    addressline2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    country_code: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    default_billing: DataTypes.BOOLEAN,
    default_shipping: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN
  }, {});
  user_address.associate = function(models) {
    // associations can be defined here
  };
  return user_address;
};