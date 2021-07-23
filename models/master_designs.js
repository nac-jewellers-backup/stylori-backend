'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_designs = sequelize.define('master_designs', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    is_filter: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    filter_order : DataTypes.INTEGER,
    alias_id : DataTypes.INTEGER
  }, {});
  master_designs.associate = function(models) {
    // associations can be defined here
  };
  return master_designs;
};