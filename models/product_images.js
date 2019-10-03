'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_images = sequelize.define('product_images', {
    product_color: DataTypes.STRING,
    product_id: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {});
  product_images.associate = function(models) {
    // associations can be defined here
  };
  return product_images;
};