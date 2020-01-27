'use strict';
module.exports = (sequelize, DataTypes) => {
  const asktoexpert = sequelize.define('asktoexpert', {
    product_sku: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    message: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  asktoexpert.associate = function(models) {
    // associations can be defined here
  };
  return asktoexpert;
};