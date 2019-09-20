'use strict';
module.exports = (sequelize, DataTypes) => {
  const product_occassions = sequelize.define('product_occassions', {
    occassion_name: DataTypes.STRING,
    product_id: DataTypes.STRING
  }, {});
  product_occassions.associate = function(models) {
    // associations can be defined here
  };
  return product_occassions;
};