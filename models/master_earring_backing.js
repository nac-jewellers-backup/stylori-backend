'use strict';
module.exports = (sequelize, DataTypes) => {
  const master_earring_backing = sequelize.define('master_earring_backing', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {});
  master_earring_backing.associate = function(models) {
    // associations can be defined here
  };
  return master_earring_backing;
};