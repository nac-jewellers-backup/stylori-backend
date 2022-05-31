"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_attribute = sequelize.define(
    "product_attribute",
    {
      attribute_name: DataTypes.STRING,
      product_id: DataTypes.STRING,
      master_id: DataTypes.INTEGER,
      attribute_id: DataTypes.INTEGER,
      is_active: DataTypes.BOOLEAN,
    },
    {}
  );
  product_attribute.associate = function (models) {
    // associations can be defined here
    product_attribute.belongsTo(models.attributes, {
      foreignKey: "attribute_id",
      targetKey: "id",
    });
    product_attribute.belongsTo(models.Attribute_master, {
      foreignKey: "master_id",
      targetKey: "id",
    });
    product_attribute.belongsTo(models.product_lists, {
      foreignKey: "product_id",
      targetKey: "product_id",
    });
  };
  return product_attribute;
};
