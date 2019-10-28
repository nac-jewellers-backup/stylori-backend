'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_gender = sequelize.define('product_gender', {
    gender_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_gender.associate = function(models) {
    // associations can be defined here
  };
  return product_gender;
};