'use strict';
module.exports = (sequelize, DataTypes) => {
  const price_running_history = sequelize.define('price_running_history', {
    pricing_component: DataTypes.STRING,
    product_ids: DataTypes.TEXT,
    total_product: DataTypes.INTEGER
  }, {});
  price_running_history.associate = function(models) {
    // associations can be defined here
  };
  return price_running_history;
};