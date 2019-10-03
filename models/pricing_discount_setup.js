'use strict';
module.exports = (sequelize, DataTypes) => {
  const pricing_discount_setup = sequelize.define('pricing_discount_setup', {
    name: DataTypes.STRING,
    discount_type: DataTypes.INTEGER,
    discount_value: DataTypes.DOUBLE,
    diamond_discount: DataTypes.DOUBLE,
    gemstone_discount: DataTypes.DOUBLE,
    makingcharge_discount: DataTypes.DOUBLE,
    goldprice_discount: DataTypes.DOUBLE,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {});
  pricing_discount_setup.associate = function(models) {
    // associations can be defined here
    models.pricing_discount_setup.hasMany(models.discount_occassions_mapping,{
      foreignKey: 'discount_id',
      targetKey: 'id'
    });
    models.pricing_discount_setup.hasMany(models.discount_styles_mapping,{
      foreignKey: 'discount_id',
      targetKey: 'id'
    });
    models.pricing_discount_setup.hasMany(models.discount_themes_mapping,{
      foreignKey: 'discount_id',
      targetKey: 'id'
    });
    models.pricing_discount_setup.hasMany(models.discount_product_type_mapping,{
      foreignKey: 'discount_id',
      targetKey: 'id'
    });
    models.pricing_discount_setup.hasMany(models.discount_productcategory_mapping,{
      foreignKey: 'discount_id',
      targetKey: 'id'
    });
  };
  return pricing_discount_setup;
};