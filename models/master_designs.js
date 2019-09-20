'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_designs = sequelize.define('master_designs', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_designs.associate = function(models) {
    // associations can be defined here
  };
  return master_designs;
};