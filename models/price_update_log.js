'use strict';
module.exports = (sequelize, DataTypes) => {
  const price_update_log = sequelize.define('price_update_log', {
    params: DataTypes.STRING
  }, {});
  price_update_log.associate = function(models) {
    // associations can be defined here
  };
  return price_update_log;
};