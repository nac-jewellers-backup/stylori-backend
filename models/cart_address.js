'use strict';
module.exports = (sequelize, DataTypes) => {
  const cart_address = sequelize.define('cart_address', {
    cart_id: DataTypes.STRING,
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
    address_type: DataTypes.INTEGER
  }, {});
  cart_address.associate = function(models) {
    // associations can be defined here
  };
  return cart_address;
};