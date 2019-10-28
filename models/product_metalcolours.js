'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_metalcolours = sequelize.define('product_metalcolours', {
    product_color: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_metalcolours.associate = function(models) {
    // associations can be defined here
  };
  return product_metalcolours;
};