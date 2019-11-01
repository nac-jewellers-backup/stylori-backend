
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const sequelize= require('sequelize');

import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.filteroptions = async (req, res) => {

const {material, theme,collection, occassion, style, metalpurity, producttype, stoneshape, gender, stonecolor, stonecount } = req.body
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
if(collection)
{
  whereclause['$product_collections.collection_name$'] = {
    [Op.eq]:collection
    }
    includeclause.push({
      model : models.product_collections
     })
}
if(occassion)
{
  whereclause['$product_occassions.occassion_name$'] = {
    [Op.eq]:occassion
    }
    includeclause.push({
      model : models.product_occassions
     })
}
if(stoneshape)
{
  whereclause['$product_gemstones.gemstone_shape$'] = {
    [Op.eq]:stoneshape
    }
    includeclause.push({
      model : models.product_gemstones
     })
}
if(style)
{
  whereclause['$product_styles.style_name$'] = {
    [Op.eq]:style
    }
    includeclause.push({
      model : models.product_styles
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

if(stonecolor)
{
  whereclause['$product_stonecolor.stonecolor$'] = {
    [Op.eq]:stonecolor
    }
    includeclause.push({
           model : models.product_stonecolor
    })
}

if(stonecount)
{
  whereclause['$product_stonecount.stonecount$'] = {
    [Op.eq]:stonecount
    }
    includeclause.push({
           model : models.product_stonecount
    })
}
if(producttype)
{
  whereclause['product_type']= {
    [Op.eq]:producttype
    }

}

if(metalpurity)
{
  whereclause['$product_purities.purity$'] = {
    [Op.eq]:metalpurity
    }
    includeclause.push({
           model : models.product_purities
    })

}
if(gender)
{
  whereclause['$product_genders.gender_name$'] = {
    [Op.eq]:gender
    }
    includeclause.push({
           model : models.product_genders
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


 
let prod_type_where = {} 

  if(product_list.length)
  {
    prod_type_where =  {
      product_id : {
        [Op.in]: product_list
      }
    }
  }

  var master_stonecolor = await models.product_stonecolor.findAll({
    attributes: ['stonecolor'],
    group: ['stonecolor'],
    where:prod_type_where
  })


  var master_stonecount = await models.product_stonecount.findAll({
    attributes: ['stonecount'],
    group: ['stonecount'],
    where:prod_type_where
  })

 var master_product_type = await models.product_lists.findAll({
    attributes: ['product_type'],
    group: ['product_type'],
    where:prod_type_where
  })


  var master_styles = await models.product_styles.findAll({
    attributes: ['style_name'],
    group: ['style_name'],
    where: prod_type_where
    
  })

  var theme_whereclause = {
    theme_name : {
      [Op.ne]: null
    }
  }
  if(product_list.length > 0)
  {
    theme_whereclause = {
      theme_name : {
        [Op.ne]: null
      },
      product_id : {
        [Op.in]: product_list
      }
    }
  }
  
  var master_themes = await models.product_themes.findAll({
    attributes: ['theme_name'],
    group: ['theme_name'],
    where: theme_whereclause
  })

  var master_occassion = await models.product_occassions.findAll({
    attributes: ['occassion_name'],
    group: ['occassion_name'],
    where: prod_type_where
  })
  
  let material_whereclause = {}
  if(product_list.length > 0)
  {
    material_whereclause = {
      product_sku : {
        [Op.in]: product_list
      }
    }
  }

  var master_material = await models.product_materials.findAll({
    attributes: ['material_name'],
    group: ['material_name'],
    where: material_whereclause
  })




  var gemstone_shape = await models.product_gemstones.findAll({
    attributes: ['gemstone_shape'],
    group: ['gemstone_shape'],
    where: material_whereclause
  })

  let collection_whereclause = {}
  if(product_list.length > 0)
  {
    collection_whereclause = {
      product_id : {
        [Op.in]: product_list
      }
    }
  }
  var master_collection = await models.product_collections.findAll({
    attributes: ['collection_name'],
    group: ['collection_name'],
    where: collection_whereclause
  })

  
  let purity_where = {}
  if(product_list.length > 0)
  {
    purity_where =  {
      product_id : {
        [Op.in]: product_list
      }
    }
  }
  var master_purity = await models.product_purities.findAll({
    attributes: ['purity'],
    group: ['purity'],
    where:purity_where
  })


  var master_gender = await models.product_gender.findAll({
    attributes: ['gender_name'],
    group: ['gender_name'],
    where:purity_where
  })


  var metalcolor_where = {
    metal_color : {
      [Op.ne]: null
    }
  }

  if(product_list.length > 0)
  {
    metalcolor_where = {
      metal_color : {
        [Op.ne]: null
      }

    }
  }
  var seo_url = 'white+gold-drops-earrings-jewellery'
  var seo_text = 'For casual, formal and everything in between. Stylori\'s range of earrings suits every style and occasion. Choose from our collections of gold earrings and diamond earrings with a diverse range of drops, ear studs and many more styles. Shop online for the latest trends in fashion jewellery or plan for a wedding with the bridal jewellery collection. Crafted using the finest jewellery design and jewellery making principles, buy our jewellery online for fast deliveries and an easy returns policy.For every occasion and non-occasion. Shop our range of everyday fashion jewellery featuring gold, silver and stone rings and earrings, for work, play and everything in between. Give special occasions a little extra glimmer with our range of bridal jewellery ranging from engagement rings to wedding rings to classic party wear. Crafted using the finest jewellery design and jewellery making principles, buy our jewellery online for fast deliveries and an easy returns policy.'
  var master_colors = await models.trans_sku_lists.findAll({
    attributes: ['metal_color'],
    group: ['metal_color'],
    where: metalcolor_where
  })
  var price_range = await models.trans_sku_lists.findAll({
    attributes:[[sequelize.fn('max', sequelize.col('selling_price_tax')),'max'],[sequelize.fn('min', sequelize.col('selling_price_tax')),'min']]
  ,
    where: metalcolor_where
  })

    res.send(200,{master_category,master_product_type,master_styles,master_themes,
        master_occassion,
        master_material,
        master_collection,
        master_purity,
        master_colors,
        gemstone_shape,
        master_gender,
        master_stonecolor,
        master_stonecount,
        price_range,
        seo_url,
        seo_text
        })
}