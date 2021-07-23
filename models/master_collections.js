'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_collections = sequelize.define('master_collections', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER,
    alias_id : DataTypes.INTEGER
  }, {});
  master_collections.associate = function(models) {
    // associations can be defined here
  };
  return master_collections;
};