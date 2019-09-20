'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_metals_purities = sequelize.define('master_metals_purities', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    short_code: DataTypes.INTEGER
  }, {});
  master_metals_purities.associate = function(models) {
    // associations can be defined here
  };
  return master_metals_purities;
};