'use strict';
module.exports = (sequelize, DataTypes) => {
  const askus = sequelize.define('askus', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    message: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  askus.associate = function(models) {
    // associations can be defined here
  };
  return askus;
};