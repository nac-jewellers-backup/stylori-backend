'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_collections = sequelize.define('master_collections', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: isFilter,
    is_active : isActive,
    filter_order : filterOrder
  }, {});
  master_collections.associate = function(models) {
    // associations can be defined here
  };
  return master_collections;
};