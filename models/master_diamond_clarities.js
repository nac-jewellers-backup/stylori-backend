'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_diamond_clarities = sequelize.define('master_diamond_clarities', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_diamond_clarities.associate = function(models) {
    // associations can be defined here
  };
  return master_diamond_clarities;
};