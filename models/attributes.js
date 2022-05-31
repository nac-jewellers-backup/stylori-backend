"use strict";
module.exports = (sequelize, DataTypes) => {
  const attributes = sequelize.define(
    "attributes",
    {
      name: DataTypes.STRING,
      master_id: DataTypes.INTEGER,
      alias_id: DataTypes.INTEGER,
      alias: DataTypes.STRING,
      short_code: DataTypes.STRING,
      filter_position: DataTypes.INTEGER,
      is_filter: DataTypes.BOOLEAN,
      is_search: DataTypes.BOOLEAN,
      is_active: DataTypes.BOOLEAN,
    },
    {}
  );
  attributes.associate = function (models) {
    // associations can be defined here
    attributes.belongsTo(models.Attribute_master, {
      foreignKey: "master_id",
      targetKey: "id",
    });
  };
  return attributes;
};
