'use strict';
module.exports = (sequelize, DataTypes) => {
  const stylori_top_carousel = sequelize.define('stylori_top_carousel', {
    url: DataTypes.STRING,
    mobile: DataTypes.STRING,
    web: DataTypes.STRING,
    position: DataTypes.INTEGER,
    url_param: DataTypes.STRING
  }, {});
  stylori_top_carousel.associate = function(models) {
    // associations can be defined here
  };
  return stylori_top_carousel;
};