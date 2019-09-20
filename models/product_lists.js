'use strict';
const uuidv1 = require('uuid/v1');

module.exports = (sequelize, DataTypes) => {
  const product_lists = sequelize.define('product_lists', {
    id:
    { 
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: uuidv1(),
        
    },
    product_id:
    {
      type: DataTypes.STRING,
      primaryKey: true
    },
    vendor_code: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_series: DataTypes.INTEGER,
    isactive: DataTypes.BOOLEAN,
    default_size: DataTypes.DOUBLE,
    default_weight: DataTypes.DOUBLE,
    gender: DataTypes.STRING,
    height: DataTypes.DOUBLE,
    width: DataTypes.DOUBLE,
    length: DataTypes.DOUBLE,
    product_type: DataTypes.STRING,
    product_vendor_code: DataTypes.STRING,
    isreorderable: DataTypes.BOOLEAN,

  }, {timestamps:false,freezeTableName: true});
  product_lists.associate = function(models) {
    // associations can be defined here
     // models.trans_sku_lists.hasMany(models.product_diamonds,{
    //   foreignKey: 'product_sku',
    //   targetKey: 'generated_sku'
    // });
    models.product_lists.hasMany(models.product_materials,{
      foreignKey: 'product_sku',
      targetKey: 'product_id'
    });
    models.product_lists.hasMany(models.product_diamonds,{
      foreignKey: 'product_sku',
      targetKey: 'product_id'
    });
    models.product_lists.hasMany(models.product_gemstones,{
      foreignKey: 'product_sku',
      targetKey: 'product_id'
    });

    models.product_lists.hasMany(models.trans_sku_lists,{
      foreignKey: 'product_id',
      targetKey: 'product_id'
    });
  };
  return product_lists;
};