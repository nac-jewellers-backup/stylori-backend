
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const sequelize= require('sequelize');
import {sendMail} from "./notify/user_notify"
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.filteroptions = async (req, res) => {

const {material,product_category, theme,collection, occasion, style, metalpurity, producttype, stoneshape, gender, stonecolor,metalcolor,noofstones,availability} = req.body
var product_list = [];
var whereclause = {
  isactive: true
};
var skuwhereclause = {}
var includeclause = [];
// var seofilterattribute = []
// var seofilterattributevalue = []
//   seofilterattribute.push('Category')
//   seofilterattributevalue.push(product_category)
  if(product_category)
  {
    whereclause = {
      product_category : product_category
    }
  }

  if(metalcolor)
  {
    skuwhereclause['metal_color'] = metalcolor
  }
//   if(availability)
//   {
//     seofilterattribute.push('Availability')
//     seofilterattributevalue.push(availability)
//   }
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


 

if(collection)
{

  // whereclause['$product_collections.collection_name$'] = {
  //   [Op.eq]:collection
  //   }
    includeclause.push({
      model : models.product_collections,
      where: {
        collection_name : collection
      }
     })
}
if(occasion)
{

  whereclause['$product_occassions.occassion_name$'] = {
    [Op.eq]:occasion
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
  includeclause.push({
    model : models.product_styles,
    where:{
      style_name: style
    }
   })
  // whereclause['$product_styles.style_name$'] = {
  //   [Op.eq]:style
  //   }
    
}
if(theme)
{

  // whereclause['$product_themes.theme_name$'] = {
  //   [Op.eq]:theme
  //   }
    includeclause.push({
           model : models.product_themes,
           where:{
            theme_name : theme
           }
    })
}

if(stonecolor)
{

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

  whereclause['product_type']= {
    [Op.eq]:producttype
    }
}
console.log("><><<><><")
console.log(metalpurity)
if(metalpurity)
{
  console.log("metalpurity class set")
  // includeclause.push({
  //   model : models.trans_sku_lists,
  //   attributes:[
  //       'purity'],
  //     where:{
  //       purity : metalpurity
  //     }
  //  })
    // whereclause['$product_purities.purity$'] = {
    // [Op.eq]:metalpurity
    // }
    // includeclause.push({
    //        model : models.product_purities,
    //        attributes: ['purity']
    // })
    skuwhereclause['purity'] = metalpurity
    console.log(JSON.stringify(includeclause))
    whereclause['$product_purities.purity$']
}

if(gender)
{

  whereclause['$product_genders.gender_name$'] = {
    [Op.eq]:gender
    }
    includeclause.push({
           model : models.product_gender
    })

}

includeclause.push({
  model : models.trans_sku_lists,
  as: 'transSkuListsByProductId',
  attributes:[
    ['sku_size','skuSize'],
    'purity',
    ['diamond_type','diamondType'],
    ['metal_color','metalColor'],
    ['markup_price','markupPrice'],
    ['selling_price','sellingPrice'],
    ['discount_price','discountPrice'],
    ['generated_sku','generatedSku'],
    ['is_ready_to_ship','isReadyToShip'],
    ['vendor_delivery_time','vendorDeliveryTime']],
    where:skuwhereclause
 })
 includeclause.push({
  model : models.product_diamonds,
  as : 'productDiamondsByProductSku',
  attributes : [
                ['diamond_clarity','diamondClarity'],
                ['diamond_colour','diamondColour'],
                ['diamond_type','diamondType'],
                ['stone_weight','stoneWeight'],
                ['diamond_shape','diamond_Shape'],
                ['diamond_settings','diamond_Settings'],
                ['stone_count','stone_Count']
                ]
 })
 includeclause.push({
  model : models.product_images,
  as : 'productImagesByProductId',
  attributes : [
                ['ishover','ishover'],
                ['image_url','imageUrl'],
                ['image_position','imagePosition'],
                ['isdefault','isdefault']
                ]
 })

 includeclause.push({
  model : models.product_materials,
  as : 'productMaterialsByProductSku',
  attributes : [
                ['material_name','materialName']
               
                ]
 })
 if(material)
 {         
  
 
  //  whereclause['$product_materials.material_name$'] = {
  //    [Op.eq]:material
  //    }
     includeclause.push({
       model : models.product_materials,
       where: {
        material_name: material
       }
      })
 }
console.log(JSON.stringify(includeclause))
// var total_count = await models.product_lists.findOne({
//   attributes: [ [sequelize.fn('count', sequelize.col('product_id')), 'count']],
  
//   where:{
//     isactive : true
//   }

// })


var products = await models.product_lists.findAll ({
    attributes:[['product_name','productName'],
    ['product_id','productId'],
    ['default_size','defaultSize'],
    ['size_varient','sizeVarient'],
    ['product_type','productType']
    ],
    include:includeclause,
    where:whereclause,

    limit : 24
  })



    res.send(200,{'data':{'totalCount':200,'allProductLists':products}}
              )
}