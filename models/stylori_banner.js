'use strict';
module.exports = (sequelize, DataTypes) => {
  const stylori_banner = sequelize.define('stylori_banner', {
    url: DataTypes.STRING,
    mobile: DataTypes.STRING,
    web: DataTypes.STRING,
    position: DataTypes.INTEGER
  }, {});
  stylori_banner.associate = function(models) {
    // associations can be defined here
  };
  return stylori_banner;
};