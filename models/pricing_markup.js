'use strict';
module.exports = (sequelize, DataTypes) => {
  const pricing_markup = sequelize.define('pricing_markup', {
    material: DataTypes.STRING,
    markup_type: DataTypes.INTEGER,
    selling_price_min: DataTypes.DOUBLE,
    selling_price_max: DataTypes.DOUBLE,
    markup_value: DataTypes.DOUBLE,
    // category: DataTypes.STRING,
    // product_type : DataTypes.STRING
  }, {});
  pricing_markup.associate = function(models) {
    // associations can be defined here
  };
  return pricing_markup;
};