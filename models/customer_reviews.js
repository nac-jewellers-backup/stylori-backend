'use strict';
module.exports = (sequelize, DataTypes) => {
  const customer_reviews = sequelize.define('customer_reviews', {
    product_id: DataTypes.STRING,
    product_sku: DataTypes.STRING,
    customer_name: DataTypes.STRING,
    userprofile_id: DataTypes.UUID,
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    is_publish: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN
  }, {});
  customer_reviews.associate = function(models) {
    // associations can be defined here
  };
  return customer_reviews;
};