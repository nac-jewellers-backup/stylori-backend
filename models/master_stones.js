'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_stones = sequelize.define('master_stones', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER
  }, {});
  master_stones.associate = function(models) {
    // associations can be defined here
  };
  return master_stones;
};