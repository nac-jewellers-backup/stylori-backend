'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_styles = sequelize.define('product_styles', {
    style_name: DataTypes.STRING,
    product_id: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  product_styles.associate = function(models) {
    // associations can be defined here
  };
  return product_styles;
};