
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.filteroptions = async (req, res) => {

const {material, theme, occassion, style } = req.body
var product_list = [];
var whereclause = {};
var includeclause = [];

// [
//   {
//    model : models.product_materials
//   },
//   {
//     model : models.product_themes
//    },{
//     model : models.product_occassions
//    },
//    {
//     model : models.product_styles
//    }]


// '$product_materials.material_name$':
//       {
//       [Op.eq]:material
//       },
//       '$product_themes.theme_name$':
//       {
//       [Op.eq]:theme
//       },
//       '$product_occassions.occassion_name$':
//           {
//           [Op.eq]:occassion
//         },
//         '$product_styles.style_name$':
//           {
//           [Op.eq]:style
//           },
if(material)
{
  whereclause['$product_materials.material_name$'] = {
    [Op.eq]:material
    }
    includeclause.push({
      model : models.product_materials
     })
}
if(theme)
{
  whereclause['$product_themes.theme_name$'] = {
    [Op.eq]:theme
    }
    includeclause.push({
           model : models.product_themes
    })
}
var products = await models.product_lists.findAll({
    attributes:['product_id'],
    include:includeclause,
    where: whereclause
  })
products.forEach(element => {
    product_list.push(element.product_id);
});



var master_category =    await models.master_product_categories.findAll({
  
    
})


 


 var master_product_type = await models.product_lists.findAll({
    attributes: ['product_type'],
    group: ['product_type']
  })


  var master_styles = await models.product_styles.findAll({
    attributes: ['style_name'],
    group: ['style_name'],
    where: {
      product_id : {
        [Op.in]: product_list
      }
    }
    
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
    group: ['occassion_name'],
    where: {
      product_id : {
        [Op.in]: product_list
      }
    }
  })
  

  var master_material = await models.product_materials.findAll({
    attributes: ['material_name'],
    group: ['material_name'],
    where: {
      product_sku : {
        [Op.in]: product_list
      }
    }
  })
  var master_collection = await models.product_collections.findAll({
    attributes: ['collection_name'],
    group: ['collection_name'],
    where: {
      product_id : {
        [Op.in]: product_list
      }
    }
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
    group: ['metal_color'],
    where: {
      metal_color : {
        [Op.ne]: null
      }
    }
  })

    res.send(200,{master_category,master_product_type,master_styles,master_themes,
        master_occassion,
        master_material,
        master_collection,
        master_purity,
        master_colors
        })
}