'use strict';
module.exports = (sequelize, DataTypes) => {
  const seo_url_priorities = sequelize.define('seo_url_priorities', {
    attribute_name: DataTypes.STRING,
    attribute_value: DataTypes.STRING,
    seo_text: DataTypes.STRING,
    seo_url: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {});
  seo_url_priorities.associate = function(models) {
    // associations can be defined here
  };
  return seo_url_priorities;
};