
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.filteroptions = async (req, res) => {

const {product_type } = req.body
var product_list = [];
var whereclause = {};

var products = await models.product_lists.findAll({
    attributes:['product_id'],
    where: {
       // product_type
    }
  })
// products.forEach(element => {
//     product_list.push(element.product_id);
// });



var master_category =    await models.master_product_categories.findAll({
  
    
})


 


 var master_product_type = await models.product_lists.findAll({
    attributes: ['product_type'],
    group: ['product_type']
  })


  var master_styles = await models.product_styles.findAll({
    attributes: ['style_name'],
    group: ['style_name']
    // where: {
    //   product_id : {
    //     [Op.in]: product_list
    //   }
    // }
    
  })

  var master_themes = await models.product_themes.findAll({
    attributes: ['theme_name'],
    group: ['theme_name'],
    where: {
      theme_name : {
        [Op.ne]: null
      }
    }
  })

  var master_occassion = await models.product_occassions.findAll({
    attributes: ['occassion_name'],
    group: ['occassion_name']
    // where: {
    //   product_id : {
    //     [Op.in]: product_list
    //   }
    // }
  })
  

  var master_material = await models.product_materials.findAll({
    attributes: ['material_name'],
    group: ['material_name']
    // where: {
    //   product_sku : {
    //     [Op.in]: product_list
    //   }
    // }
  })
  var master_collection = await models.product_collections.findAll({
    attributes: ['collection_name'],
    group: ['collection_name']
    // where: {
    //   product_id : {
    //     [Op.in]: product_list
    //   }
    // }
  })


  var master_collection = await models.product_collections.findAll({
    attributes: ['collection_name'],
    group: ['collection_name']
  })

  var master_purity = await models.trans_sku_lists.findAll({
    attributes: ['purity'],
    group: ['purity']
  })

  var master_colors = await models.trans_sku_lists.findAll({
    attributes: ['metal_color'],
    group: ['metal_color']
  })

    res.send(200,{master_themes})
}