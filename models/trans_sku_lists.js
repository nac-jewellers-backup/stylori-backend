'use strict';
const uuidv1 = require('uuid/v1');

module.exports = (sequelize, DataTypes) => {
  const trans_sku_lists = sequelize.define('trans_sku_lists', {
    id:
    { 
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.UUID,
        defaultValue: uuidv1(),
        primaryKey: true,

    },
    purity: {
      type: DataTypes.INTEGER
    },
    metal_color: {
      type: DataTypes.STRING
    },
    product_id: {
      type: DataTypes.STRING
    },
    isdefault: {
      type: DataTypes.BOOLEAN
    },
    
    diamond_type: {
      type: DataTypes.STRING
    },

    generated_sku: {
      type: DataTypes.STRING,

    },
    sku_weight:{
      type: DataTypes.DOUBLE
    }, 
    cost_price:{
      type: DataTypes.DOUBLE
    },
    selling_price:{
      type: DataTypes.DOUBLE
    }, 
    margin_on_sale_percentage:{
      type: DataTypes.DOUBLE
    } }, {
        timestamps: false,
        freezeTableName: true
    });
  trans_sku_lists.associate = function(models) {
    // associations can be defined here
    //models.trans_sku_lists.hasMany(models.product_materials)
    // models.trans_sku_lists.hasMany(models.product_materials,{
    //   foreignKey: 'product_sku',
    //   targetKey: 'generated_sku'
    // });
    // models.trans_sku_lists.hasMany(models.product_diamonds,{
    //   foreignKey: 'product_sku',
    //   targetKey: 'generated_sku'
    // });
    models.trans_sku_lists.belongsTo(models.product_lists,{
      foreignKey: 'product_id',
      targetKey: 'product_id'
    });
    


  };
  return trans_sku_lists;
};