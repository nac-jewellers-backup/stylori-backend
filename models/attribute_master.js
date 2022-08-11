"use strict";
module.exports = (sequelize, DataTypes) => {
  const attribute_master = sequelize.define(
    "Attribute_master",
    {
      name: DataTypes.STRING,
      short_code: DataTypes.STRING,
      is_filter: DataTypes.BOOLEAN,
      is_search: DataTypes.BOOLEAN,
      filter_position: DataTypes.INTEGER,
      is_top_menu: DataTypes.BOOLEAN,
      is_active: DataTypes.BOOLEAN,
    },
    {}
  );
  attribute_master.associate = function (models) {
    // associations can be defined here
    attribute_master.hasMany(models.attributes, {
      foreignKey: "master_id",
      targetKey: "id",
    });
  };
  return attribute_master;
};
