
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const sequelize= require('sequelize');

import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.filteroptions = async (req, res) => {

const {material,product_category, theme,collection, occasion, style, metalpurity, producttype, stoneshape, gender, stonecolor,metalcolor,noofstones,availability} = req.body
var product_list = [];
var whereclause = {};
var includeclause = [];
var seofilterattribute = []
var seofilterattributevalue = []
  seofilterattribute.push('Category')
  seofilterattributevalue.push('Jewellery')
  if(product_category)
  {
  seofilterattribute.push('Category')
  seofilterattributevalue.push(product_category)
  }
  if(availability)
  {
    seofilterattribute.push('Availability')
    seofilterattributevalue.push(availability)
  }
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
  seofilterattribute.push('Material')
  seofilterattributevalue.push(material)

  whereclause['$product_materials.material_name$'] = {
    [Op.eq]:material
    }
    includeclause.push({
      model : models.product_materials
     })
}
if(collection)
{
  

  seofilterattribute.push('Collection')
  seofilterattributevalue.push(collection)
  whereclause['$product_collections.collection_name$'] = {
    [Op.eq]:collection
    }
    includeclause.push({
      model : models.product_collections
     })
}
if(occasion)
{
  seofilterattribute.push('Occasion')
  seofilterattributevalue.push(occasion)
  whereclause['$product_occassions.occassion_name$'] = {
    [Op.eq]:occasion
    }
    includeclause.push({
      model : models.product_occassions
     })
}
console.log("><><<><><")
console.log(stoneshape)
if(stoneshape)
{
  seofilterattribute.push('Stone Shape')
  seofilterattributevalue.push(stoneshape)
  
  whereclause['$product_gemstones.gemstone_shape$'] = {
    [Op.eq]:stoneshape
    }
    includeclause.push({
      model : models.product_gemstones
     })
}
if(style)
{
  seofilterattribute.push('Style')
  seofilterattributevalue.push(style)
  whereclause['$product_styles.style_name$'] = {
    [Op.eq]:style
    }
    includeclause.push({
      model : models.product_styles
     })
}
if(theme)
{
  seofilterattribute.push('Theme')
  seofilterattributevalue.push(theme)
  whereclause['$product_themes.theme_name$'] = {
    [Op.eq]:theme
    }
    includeclause.push({
           model : models.product_themes
    })
}

if(stonecolor)
{
  seofilterattribute.push('Stone Color')
  seofilterattributevalue.push(stonecolor)
  whereclause['$product_stonecolors.stonecolor$'] = {
    [Op.eq]:stonecolor
    }
    includeclause.push({
           model : models.product_stonecolor
    })
}

 if(noofstones)
 {
     seofilterattribute.push('No Of Stones')
   seofilterattributevalue.push(noofstones)
  // whereclause['$product_stonecount.stonecount$'] = {
  //   [Op.eq]:noofstones
  //   }
  //   includeclause.push({
  //          model : models.product_stonecount
  //   })
 }
if(producttype)
{
  seofilterattribute.push('Product Type')
  seofilterattributevalue.push(producttype)
  
  whereclause['product_type']= {
    [Op.eq]:producttype
    }
}

if(metalpurity)
{
  seofilterattribute.push('Metal Purity')
  seofilterattributevalue.push(metalpurity)
  whereclause['$product_purities.purity$'] = {
    [Op.eq]:metalpurity
    }
    includeclause.push({
           model : models.product_purities
    })

}

if(gender)
{

  
  seofilterattribute.push('Gender')
  seofilterattributevalue.push(gender)
  whereclause['$product_genders.gender_name$'] = {
    [Op.eq]:gender
    }
    includeclause.push({
           model : models.product_gender
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
    where: prod_type_where,
    order: [
      ['style_name', 'ASC']
    ]
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
    where: theme_whereclause,
    order: [
      ['theme_name', 'ASC']
    ]
  })

  var master_occassion = await models.product_occassions.findAll({
    attributes: ['occassion_name'],
    group: ['occassion_name'],
    where: prod_type_where,
    order: [
      ['occassion_name', 'ASC']
    ]
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
    where: material_whereclause,
    order: [
      ['material_name', 'ASC']
    ]
  })




  var gemstone_shape = await models.product_gemstones.findAll({
    attributes: ['gemstone_shape'],
    group: ['gemstone_shape'],
    where: material_whereclause,
    order: [
      ['gemstone_shape', 'ASC']
    ]
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
    where: collection_whereclause,
    order: [
      ['collection_name', 'ASC']
    ]
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
    where:purity_where,
    order: [
      ['purity', 'ASC']
    ]
  })


  var master_gender = await models.product_gender.findAll({
    attributes: ['gender_name'],
    group: ['gender_name'],
    where:purity_where,
    order: [
      ['gender_name', 'ASC']
    ]
  })


  var metalcolor_where = {
    metal_color : {
      [Op.ne]: null
    }
  }
  

  if(product_list.length > 0)
  {
    
    metalcolor_where = {
      product_color : {
        [Op.ne]: null
      },
      product_id : {
        [Op.in]: product_list
      }

    }
  }
  if(metalcolor)
  {
    metalcolor_where = {
      product_color : metalcolor

    }

    seofilterattribute.push('Metal Color')
  seofilterattributevalue.push(metalcolor)
    
  }
  var seo_url = ''
  var seo_text = ''
  var master_colors = await models.product_metalcolours.findAll({
    attributes: ['product_color'],
    group: ['product_color'],
    where: metalcolor_where,
    order: [
      ['product_color', 'ASC']
    ]
  })

  var price_range2 = await models.trans_sku_lists.findOne({
    attributes:["selling_price"]
  ,
    include:[
      {
        
        require: true,
        model : models.product_lists,
        include:includeclause,
        where: whereclause,
      }
    ],
    order: [
      ['selling_price', 'ASC']
    ]
  })
  var price_range1 = await models.trans_sku_lists.findOne({
    attributes:["selling_price"]
  ,
    include:[
      {
        attributes: ['id'],
        model : models.product_lists,
        require: true
      }
    ],
    where:{
      "selling_price" :{
        [Op.ne] : null
      }
    },
    limit : 1,
    order: [
      ['selling_price', 'DESC']
    ]
  })
  var price_range = {
    "min":price_range2.selling_price,
    "max":price_range1.selling_price
  }

  var seooptions = await models.seo_url_priorities.findAll({
  
    where: {
      attribute_name : {
        [Op.in]: seofilterattribute
      },
      attribute_value:
      {
        [Op.in]: seofilterattributevalue
      }
    },
    order: [
      ['priority', 'ASC']
  ],

  })
   var seourls_arr= []
   var seotexts_arr= []

    seooptions.forEach(element =>{
      seourls_arr.push(element.seo_url);
      seotexts_arr.push(element.seo_text)
    })
    seo_url = seourls_arr.join('-')
    seo_text = seotexts_arr.join(' ')
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
    //    price_range,
        seo_url,
        seo_text
              })
}