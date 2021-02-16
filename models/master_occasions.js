'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_occasions = sequelize.define('master_occasions', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER,
    alias_id : DataTypes.INTEGER
  }, {});
  master_occasions.associate = function(models) {
    // associations can be defined here
  };
  return master_occasions;
};