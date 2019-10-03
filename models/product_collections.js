'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_collections = sequelize.define('product_collections', {
    collection_name: DataTypes.STRING,
    product_id: DataTypes.STRING
  }, {});
  product_collections.associate = function(models) {
    // associations can be defined here
  };
  return product_collections;
};