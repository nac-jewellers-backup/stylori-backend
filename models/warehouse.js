"use strict";
module.exports = (sequelize, DataTypes) => {
  const warehouse = sequelize.define(
    "warehouse",
    {
      name: DataTypes.STRING,
      shipping_in_days: DataTypes.INTEGER,
    },
    {}
  );
  warehouse.associate = function (models) {
    // associations can be defined here
    warehouse.hasMany(models.inventory, {
      foreignKey: "warehouse_id",
    });
  };
  return warehouse;
};
