'use strict';
module.exports = (sequelize, DataTypes) => {
  const uniquepages = sequelize.define('uniquepages', {
    displayname: DataTypes.TEXT,
    pagename: DataTypes.TEXT
  }, {});
  uniquepages.associate = function(models) {
    // associations can be defined here
  };
  return uniquepages;
};