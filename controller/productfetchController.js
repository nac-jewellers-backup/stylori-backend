
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const sequelize= require('sequelize');
import {sendMail} from "./notify/user_notify"
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.filteroptions = async (req, res) => {

const {material,Category, theme,collection, occasion, style, metalpurity, producttype, stoneshape,price, gender, stonecolor,metalcolor,noofstones,availability,sortBy,offset} = req.body
var product_list = [];
var whereclause = {
  isactive: true

};
var sortelement = []
var skuwhereclause = {}
var includeclause = [];
skuwhereclause['isdefault']  = true
var isproduct_query = false;
var currentpage = 0
//sortelement = sequelize.random()
if(offset)
{
  currentpage = offset ;
}
// var seofilterattributevalue = []
//   seofilterattribute.push('Category')
//   seofilterattributevalue.push(product_category)
  if(Category)
  {
    whereclause = {
      product_category : Category
    }
  }
  if(sortBy)
  {
    if(sortBy === 'Featured')
    {
      isproduct_query = true
      sortelement  = [
        ['is_featured', 'ASC'],
    ]
    }
    if(sortBy === 'New To Stylori')
    {
     // isproduct_query = true
      sortelement  = [
        ['"createdAt"','DESC'],
    ]
    }
    if(sortBy === 'Ready To Ship')
    {
      sortelement  = [
        [ {model: models.trans_sku_lists},'is_ready_to_ship', 'desc']
    ]


    }
    if(sortBy === 'Price High to Low')
    {
      sortelement  = [
        [ {model: models.trans_sku_lists},'markup_price', 'desc']

    ]


    }
    if(sortBy === 'Price Low to High')
    {
      sortelement  = [
        [ {model: models.trans_sku_lists},'markup_price', 'asc']

    ]


    }
    if(sortBy === 'Best Seller')
    {
      isproduct_query = true

      sortelement  = [
        [ 'selling_qty', 'asc']

    ]


    }
    console.log("sort issue")
    console.log(JSON.stringify(sortelement))
  //  [{ model: models.trans_sku_lists },  'selling_price', 'desc']
    console.log("updatedatavalue")
    console.log(JSON.stringify(sortBy))

    console.log(JSON.stringify(sortelement))

  }
  if(metalcolor)
  {
    console.log("metal colur image")
    console.log(JSON.stringify(metalcolor))
    skuwhereclause['metal_color'] = metalcolor
  }
  if(price)
  {
    if(price.min_price && price.max_price)
    {
      skuwhereclause['markup_price'] = {
        [Op.between] :[price.min_price , price.max_price]
      }
    }
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

  // whereclause['$product_occassions.occassion_name$'] = {
  //   [Op.eq]:occasion
  //   }
    includeclause.push({
      model : models.product_occassions,
      where: {
        occassion_name : occasion
      }
     })
}

if(stoneshape)
{
 
  
  // whereclause['$product_gemstones.gemstone_shape$'] = {
  //   [Op.eq]:stoneshape
  //   }
    includeclause.push({
      model : models.product_gemstones,
      where:{
        gemstone_shape : stoneshape
      }
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

  // whereclause['$product_stonecolors.stonecolor$'] = {
  //   [Op.eq]:stonecolor
  //   }
    includeclause.push({
           model : models.product_stonecolor,
           where:{
            stonecolor : stonecolor
           }
    })
}

 if(noofstones)
 {
   //  seofilterattribute.push('No Of Stones')
  // seofilterattributevalue.push(noofstones)
  // whereclause['$product_stonecount.stonecount$'] = {
  //   [Op.eq]:noofstones
  //   }
    includeclause.push({
           model : models.product_stonecount,
           where: {
            stonecount: noofstones
           }
    })
 }
if(producttype)
{

  whereclause['product_type']= {
    [Op.eq]:producttype
    }
}
if(availability)
{
  if(availability === '1')
  {
    skuwhereclause['is_ready_to_ship'] = true

  }
  else if(availability === '10+')
  {
    skuwhereclause['is_ready_to_ship'] = false

    skuwhereclause['vendor_delivery_time'] = {
      
    [Op.gt]: 10
    }
  }
  else{
    skuwhereclause['is_ready_to_ship'] = false

    skuwhereclause['vendor_delivery_time'] = {
      [Op.eq] : availability
    }


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

  // whereclause['$product_genders.gender_name$'] = {
  //   [Op.eq]:gender
  //   }
    includeclause.push({
           model : models.product_gender,
           where:{
            gender_name : gender
           }
    })

}


console.log(JSON.stringify(includeclause))
// var products_all = await models.product_lists.findAll({
//       attributes:[['product_name','productName'],
//     ['product_id','productId'],
//     ['default_size','defaultSize'],
//     ['size_varient','sizeVarient'],
//     ['product_type','productType']
//     ],
//   include:includeclause, 
//   where:whereclause,
//   limit:24,
  

// })
var prod_iclude = []

prod_iclude.push({
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
                ],
 })
 prod_iclude.push({
  model : models.product_images,
  as : 'productImagesByProductId',
  attributes : [
                ['ishover','ishover'],
                ['image_url','imageUrl'],
                ['image_position','imagePosition'],
                ['isdefault','isdefault']
                ],
   where:{
     isdefault : true,
     image_position:{
       [Op.in]:[1,2]
     }
   }             
 })

 if(material)
 {         
  
 
  //  whereclause['$product_materials.material_name$'] = {
  //    [Op.eq]:material
  //    }
  prod_iclude.push({
    model : models.product_materials,
    as : 'productMaterialsByProductSku',
    attributes : [
                  ['material_name','materialName']
                 
                  ],
                  where:{
                    material_name : material
                   }
   }) 
 }
var products_all = []
// if(isproduct_query)
// {
  prod_iclude.push({
    model : models.trans_sku_lists,
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
      
      where:skuwhereclause,
      distinct: 'trans_sku_lists.product_id'

      
   })
  
  const {count,rows}  = await models.product_lists.findAndCountAll({
    include:{
      model : models.trans_sku_lists,
      where:{
        isdefault : true
      },
     
    },
    where:whereclause,
    limit : 24,
    offset : currentpage,
    order:sortelement,
    subQuery: false
    
  })
  console.log("count value"+count)
  var product_ids = []
  rows.forEach(element => {
    
    product_ids.push(element.product_id)
  });

   products_all = await models.product_lists.findAll ({
    attributes:[['product_name','productName'],
    ['product_id','productId'],
    ['default_size','defaultSize'],
    ['size_varient','sizeVarient'],
    ['product_type','productType'],
    'is_featured',
    'selling_qty'
    ],
    include:prod_iclude,
    where:{
      product_id : {
        [Op.in]: product_ids
      }
    },
    order:sortelement,
  })
// }else{
  // products_all  = await models.trans_sku_lists.findAndCountAll({
  //   attributes:[
  //     ['sku_size','skuSize'],
  //     'purity',
  //     'product_id',
  //     ['diamond_type','diamondType'],
  //     ['metal_color','metalColor'],
  //     ['markup_price','markupPrice'],
  //     ['selling_price','sellingPrice'],
  //     ['discount_price','discountPrice'],
  //     ['generated_sku','generatedSku'],
  //     ['is_ready_to_ship','isReadyToShip'],
  //     ['vendor_delivery_time','vendorDeliveryTime']],
  //         include:[{
  //           model : models.product_lists,
  //               attributes:[['product_name','productName'],
  //             ['product_id','productId'],
  //             ['default_size','defaultSize'],
  //             ['size_varient','sizeVarient'],
  //             ['product_type','productType'],
  //             'selling_qty',
  //             'is_featured',
  //             'isactive'
  //             ],
  //           where : whereclause,
  
  //           include:includeclause,
            
             
  //         }],
  //         offset: currentpage,
  //         where:skuwhereclause,
  //         subQuery : false,
  //         order: [
  //           ['"markup_price"','ASC']
  //         ],
  //         limit: 24,

        
  // })

  
//}






    res.send(200,{'data':{'totalCount':count,'allProductLists':products_all}}
              )
}