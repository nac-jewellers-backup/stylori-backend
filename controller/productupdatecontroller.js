
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');
const sequelize = require('sequelize');

exports.updateattributes = async (req, res) => {
    models.master_product_types.findAll({
          
      where: {
       
      },
      order: [
        ['id', 'DESC']
    ],
    }).then(async categories => {
      var attributes_arr = []
      categories.forEach(element => {
        let atr_obj = {
          attribute_name : 'ProductType' ,
          attribute_value: element.name
        }
        attributes_arr.push(atr_obj)
      });
      console.log(JSON.stringify(attributes_arr))

     await  models.attribute_mapping.bulkCreate(
        attributes_arr
        , {individualHooks: true})
        res.status(200).send({message:"success"});

    }).catch(err => {
        console.log(JSON.stringify(err))
      res.status(500).send({message:"something went wring"});
    });
  }
exports.updateproduct = (req, res) => {
    req.setTimeout(50000000);


       var gemstoneobj = req.body['data-1577447269683'];
     var gemstones_obj = JSON.parse(gemstoneobj)
     console.log(JSON.stringify(gemstones_obj))
     update_material_values(gemstones_obj)
   //  update_product_materials(gemstones_obj)
    // update_gemstonesetup(gemstones_obj);
       // update_diamondpricesettings(gemstones_obj);
        //update_gemstonesetup(gemstones_obj);
    //  update_makingcharge(gemstones_obj);
      // update_markup(gemstones_obj);

   /*  var product_json_obj = req.body.Product
     var product_theme_obj = JSON.parse(req.body.Product_Theme)
     var product_style_obj = JSON.parse(req.body.Product_Style)

     var product_occassions_obj = JSON.parse(req.body.Product_Occassion)
     var product_materials_obj = JSON.parse(req.body.Product_Material)
     var product_diamonds_obj = JSON.parse(req.body.Product_Diamond)
     var product_gemstones_obj = JSON.parse(req.body.Product_Gemstone)
    var product_collections_obj = JSON.parse(req.body.Product_Collection)
    var processed_product_count = 0;
    var product_obj = JSON.parse(product_json_obj)
    updateproduct()*/
  
    //  var product_sku_obj = JSON.parse(req.body.sku)
    //    update_product_sku(product_sku_obj)

   

   
     // res.send(200,{message: 'success'})

      // update_product_gemstones(product_gemstones_obj)
   //update_product_diamonds(product_diamonds_obj)
   // update_product_collections(product_collections_obj);
   
   function updatebestsellers(bestsellers)
   {
    // models .find({ where: { title: 'aProject' } })
    // .on('success', function (project) {
    //   // Check if record exists in db
    //   if (project) {
    //     project.update({
    //       title: 'a very different title now'
    //     })
    //     .success(function () {})
    //   }
    // })


    bestsellers.forEach( async imgobj  => {
      models.product_lists.findOne({
        where: {
          product_id : imgobj.product_code
        }
      }).then(async product  => {
        await  product.update({'selling_qty':imgobj.quantity})

      })
    //  console.log(JSON.stringify(imgobj.product_code))
    })
   }
    function update_product_images(product_images)
    {
        var image_count = 0;
        console.log(product_images.length)
        var product_images_arr = [];
        product_images.forEach(imgobj  => {
            let hoverval = false
            if(imgobj.Hover)
            {
                hoverval = true
            }
            const img_obj = {
                id: uuidv1(),
                product_color : imgobj.Metal_Colour,
                product_id: imgobj.Product_Code,
                image_url: imgobj['URL '],
                image_position: imgobj.Position, 
                ishover: hoverval
            }

            if(image_count >= 21542)
            {
                product_images_arr.push(img_obj)

            }

            image_count++ 
        })
        models.product_images.bulkCreate(
            product_images_arr, {individualHooks: true}).then(function(response){
                   
                     res.send(200,{message: 'success'})
    
                })  .catch((error) => {
                          console.log("errorresponse"+error.message)
              });
    }
   function update_markup(markups)
        {
            var markup_arr = []
            markups.forEach(mkup => {
                var mkupobj = {
                    id: uuidv1(),
                    material : mkup.material,
                    markup_type: mkup.markup_type,
                    selling_price_min: mkup.selling_price_min,
                    selling_price_max: mkup.selling_price_max,
                    markup_value: mkup.markup_value,
                    createdAt: new Date(),
                    updatedAt: new Date()

                }
                markup_arr.push(mkupobj)
            })

            models.pricing_markup.bulkCreate(
                markup_arr, {individualHooks: true}).then(function(response){
                         console.log("porductskudescsuccess" )
                       
                         res.send(200,{message: 'success'})
        
                    })  .catch((error) => {
                              console.log("errorresponse"+error.message)
                  });

        }
function update_diamondpricesettings(diamondprice)
{
    var diamond_arr = [];
    diamondprice.forEach(diamond => {
        var diamond_obj = {
            id : uuidv1(),
            vendor_code : diamond.vendor_code,
            diamond_colour : diamond.diamond_colour,
            diamond_clarity : diamond.diamond_clarity,
            selling_price_type : diamond.selling_price_type,
            cost_price : diamond.cost_price,
            selling_price : diamond.selling_price,
            createdAt : new Date(),
            updatedAt : new Date()

        }
        diamond_arr.push(diamond_obj)
     
    })
 //  var diamondarr = []
  // diamondarr.push(diamond_arr[0])
    models.diamond_price_settings.bulkCreate(
        diamond_arr, {individualHooks: true}).then(function(response){
                 console.log("porductskudescsuccess" )
               
                 res.send(200,{message: 'success'})

            })  .catch((error) => {
                      console.log("errorresponse"+error.message)
          });
}
 function update_makingcharge(gsprice)
        {

            var makingchargearr = []
            gsprice.forEach(makingchargeobj => {
                console.log("$$$$$"+JSON.stringify(makingchargeobj.vendor_code))

               // [24,22,18,14].forEach(purityobj => {
                var making_chargeobj_14 = {
                    id:uuidv1(),
                    material: "Gold",
                    purity: 14,
                    vendor_code: makingchargeobj.vendor_code,
                    rate_type: makingchargeobj.rate_type,
                    price_type: makingchargeobj.price_type,
                    weight_start: makingchargeobj.weight_from,
                    weight_end: makingchargeobj.weight_to,
                    selling_price_type: makingchargeobj.selling_price_type,
                    price: makingchargeobj.price,
                    createdAt: new Date(),
                    updatedAt: new Date()

                }
                var making_chargeobj_18 = {
                    id:uuidv1(),
                    material: "Gold",
                    purity: 18,
                    vendor_code: makingchargeobj.vendor_code,
                    rate_type: makingchargeobj.rate_type,
                    price_type: makingchargeobj.price_type,
                    weight_start: makingchargeobj.weight_from,
                    weight_end: makingchargeobj.weight_to,
                    selling_price_type: makingchargeobj.selling_price_type,
                    price: makingchargeobj.price,
                    createdAt: new Date(),
                    updatedAt: new Date()

                }
                var making_chargeobj_22 = {
                    id:uuidv1(),
                    material: "Gold",
                    purity: 22,
                    vendor_code: makingchargeobj.vendor_code,
                    rate_type: makingchargeobj.rate_type,
                    price_type: makingchargeobj.price_type,
                    weight_start: makingchargeobj.weight_from,
                    weight_end: makingchargeobj.weight_to,
                    selling_price_type: makingchargeobj.selling_price_type,
                    price: makingchargeobj.price,
                    createdAt: new Date(),
                    updatedAt: new Date()

                }
                var making_chargeobj_24 = {
                    id:uuidv1(),
                    material: "Gold",
                    purity: 24,
                    vendor_code: makingchargeobj.vendor_code,
                    rate_type: makingchargeobj.rate_type,
                    price_type: makingchargeobj.price_type,
                    weight_start: makingchargeobj.weight_from,
                    weight_end: makingchargeobj.weight_to,
                    selling_price_type: makingchargeobj.selling_price_type,
                    price: makingchargeobj.price,
                    createdAt: new Date(),
                    updatedAt: new Date()

                }
                makingchargearr.push(making_chargeobj_14)
                makingchargearr.push(making_chargeobj_18)
                makingchargearr.push(making_chargeobj_22)
                makingchargearr.push(making_chargeobj_24)

          //  });
            });
   var goldarr = [];
           goldarr.push(makingchargearr[0])
            models.making_charge_settings.bulkCreate(
                makingchargearr, {individualHooks: true}).then(function(response){
                         console.log("porductskudescsuccess" )
                       
                         res.send(200,{message: 'success'})
        
                    })  .catch((error) => {
                              console.log("errorresponse"+error.message)
                  });
        }
function update_gemstonesetup(gsprice)
{
    models.master_vendors.findAll({
        
    
      }).then(vendors => {
          var insertgemstonearr = [];
            console.log(JSON.stringify(vendors))
            vendors.forEach(vendorobj => {
                var vendorid = vendorobj.short_code
                // gsprice.forEach(goldobj => {
                //     var goldobj_val = {
                //         id: uuidv1(),
                //         material: 'Gold',
                //         purity: goldobj.purity,
                //         cost_price: goldobj.cost_price,
                //         vendor_code: vendorid,
                //         selling_price_type: 1,
                //         selling_price: goldobj.selling_price,
                //         createdAt: new Date(),
                //         updatedAt: new Date()
                //     }
                //     insertgemstonearr.push(goldobj_val)

                // });

            gsprice.forEach(gemstone => {
                var gemstonobj = {
                    id: uuidv1(),
                    gemstone_type: gemstone.name,
                    vendor_code: vendorid,
                    weight_start: gemstone.weight_from,
                    weight_end: gemstone.weight_to,
                    selling_price_type:1,
                    price: gemstone.price,
                    rate_type: gemstone.rate_type,
                    price_type:gemstone.price_type,
                    createdAt: new Date(),
                    updatedAt: new Date()

                }
               insertgemstonearr.push(gemstonobj)
           }) 
        })
        models.gemstone_price_settings.bulkCreate(
                insertgemstonearr
                  , {individualHooks: true}).then(function(response){
                    console.log("porductskudescsuccess" )
                   
                    res.send(200,{message: 'success'})
    
                })  .catch((error) => {
                         console.log("errorresponse"+error.message)
                 });
                 console.log("porductskudescsuccess"+JSON.stringify(insertgemstonearr[1]) )
                //   var goldarr = [];
                //   goldarr.push(insertgemstonearr[2])
                //   goldarr.push(insertgemstonearr[3])


              
            //   models.gold_price_settings.bulkCreate(
            //     insertgemstonearr, {individualHooks: true}).then(function(response){
            //              console.log("porductskudescsuccess" )
                       
            //              res.send(200,{message: 'success'})
        
            //         })  .catch((error) => {
            //                   console.log("errorresponse"+error.message)
            //       });
      });
}
function creategemstone(gemstonearr)
{   
    var insertgemstonearr = [];
    console.log(JSON.stringify(gemstonearr))
    gemstonearr.forEach(gemstone => {
        var gemstonobj = {
            id: uuidv1(),
            name: gemstone.name,
            alias: gemstone.alias,
            short_code: gemstone.short_code,
            color_code: gemstone.color_code
        }
        insertgemstonearr.push(gemstonobj)
    })
        models.master_gemstones_types.bulkCreate(
            insertgemstonearr
              , {individualHooks: true}).then(function(response){
                console.log("porductskudescsuccess" )
               
                res.send(200,{message: 'success'})

            })  .catch((error) => {
                     console.log("errorresponse"+error.message)
             });
  
}

function updateproduct()
{
        var isreorder = false;
        var isactive = false;

        if(product_obj[processed_product_count].is_active === 'Y')
        {
            isactive = true
        }
        if(product_obj[processed_product_count].isreorderable === 'Y')
        {
            isreorder = true
        }
        var product_model_obj = {
            id : uuidv1(),
            product_id: product_obj[processed_product_count].product_code,
            product_series: processed_product_count,
            isactive: isactive,
            default_size: product_obj[processed_product_count].default_size,
            default_weight: product_obj[processed_product_count].weight_for_default_size,
            gender:product_obj[processed_product_count].gender,
            height:product_obj[processed_product_count].height,
            width:product_obj[processed_product_count].width,
            length:product_obj[processed_product_count].length,
            product_type: (product_obj[processed_product_count].product_type).replace(' ',''),
            product_vendor_code: product_obj[processed_product_count].vendor_Product_Code,
            vendor_code:product_obj[processed_product_count].Vendor_code,
            earring_backing: product_obj[processed_product_count].Earring_backing,
            isreorderable: isreorder,
            product_name: product_obj[processed_product_count].product_name
        }


        console.log("--======"+JSON.stringify(product_model_obj))
        models.product_lists.create(product_model_obj)
        .then(function(response){
            processed_product_count = processed_product_count + 1
            if(product_obj.length > processed_product_count)
            {
                updateproduct()

            }else{
                update_product_materials(product_materials_obj)

            }
         })
        .catch((error) => {
            console.log("errorresponse"+error)
        });
    }
/************** product material content ****************/
       async function update_product_materials (materialobj)
        {
            
            var product_material_array = []
            var materials_arr = materialobj;
            materials_arr.forEach( async metal => {
              
              console.log("update")
                let response = await models.product_materials.findOne({
                  where:{
                    material_name: metal.Material,
                    product_sku: metal.product_code
                  }
                })
                if(response)
                {
                var  metalobj = {
                    id: uuidv1(),
                    material_name: metal.Material,
                    product_sku: metal.product_code
                }
                product_material_array.push(metalobj);
              }
            }); 

            models.product_materials.bulkCreate(
                product_material_array
                  , {individualHooks: true}).then(function(response){
                  //   update_product_diamonds(product_diamonds_obj)

                })

        } 
  
        async function update_material_values (materialobj)
        {
            var product_material_array = []
            var materials_arr = materialobj;
           await materials_arr.forEach( async metal => {
                let response = await models.product_materials.findOne({
                  where:{
                    material_name: metal.material_name,
                    product_sku: metal.product_id
                  }
                })
                if(!response)
                {
                var  metalobj = {
                    id: uuidv1(),
                    material_name: metal.material_name,
                    product_sku: metal.product_code
                }
                product_material_array.push(metalobj);
              }else
              {
                // await models.product_materials.update({
                //   material_name : metal.material_name
                // })
              }
            }); 
            console.log("new product material"+product_material_array.length)
            // models.product_materials.bulkCreate(
            //     product_material_array
            //       , {individualHooks: true}).then(function(response){
            //       //   update_product_diamonds(product_diamonds_obj)

            //     })

        } 




        function update_product_diamonds(diamondobj)
        {
            console.log(JSON.stringify(apidata.diamond_types))
            console.log(JSON.stringify(apidata.product_diamonds))
            var product_diamonds = [];
            var diamond_types_arr = diamondobj;

            diamond_types_arr.forEach(diamondtype => {
                var  diamondobj  = {
                    id: uuidv1(),
                    diamond_colour: diamondtype.diamond_colour,
                    diamond_clarity:diamondtype.diamond_clarity,
                    diamond_settings:diamondtype.diamond_settings,
                    diamond_type:diamondtype.diamond_type,
                    diamond_shape:diamondtype.diamond_shape,
                    stone_count:diamondtype.stone_count,
                    stone_weight:diamondtype.stone_weight,
                    product_sku: diamondtype.product_code
                }
                product_diamonds.push(diamondobj);
            }); 
       //     var product_dia_arr = splitArray(product_diamonds, 5000)[2];

            models.product_diamonds.bulkCreate(
                product_diamonds
                  , {individualHooks: true}).then(function(response){
                        console.log("diamond success")
                     update_product_gemstones(product_gemstones_obj)
                })
        } 
    
        function update_product_gemstones(gemstoneobj)
        {
            var product_gemstones = [];
            var gemstones_types_arr = gemstoneobj;

            gemstones_types_arr.forEach(gemstonetype => {
                var  gemstoneobj  = {
                    id: uuidv1(),
                    gemstone_type: gemstonetype.gemstone_type,
                    gemstone_shape:gemstonetype.gemstone_shape,
                    gemstone_setting:gemstonetype.gemstone_setting,
                    gemstone_size:gemstonetype.gemstone_size,
                    stone_count:gemstonetype.stone_count,
                    stone_weight:gemstonetype.stone_weight,
                    product_sku: gemstonetype.product_code
                }
                product_gemstones.push(gemstoneobj);
            }); 

            models.product_gemstones.bulkCreate(
                product_gemstones
                  , {individualHooks: true}).then(function(response){
                    
                     update_product_occassions(product_occassions_obj);
                })
        } 

        
        function update_product_occassions(occassionsobj)
        {
            var product_occassions = [];
            var product_occassions_arr = occassionsobj

            product_occassions_arr.forEach(occassion => {
                var  occassionobj  = {
                    id: uuidv1(),
                    occassion_name: occassion.occassion_name,
                    product_id: occassion.product_id
                }
                product_occassions.push(occassionobj);
            }); 
            var product_occ_arr = splitArray(product_occassions, 5000)[1];

            models.product_occassions.bulkCreate(
                product_occ_arr
                  , {individualHooks: true}).then(function(response){
                      console.log("occassions succes");
                   update_product_collections(product_collections_obj)
                })  .catch((error) => {
                         console.log("errorresponse"+error)
                 });
        } 
        function update_product_collections(collection_obj)
        {
            var product_collections = [];
            var product_collections_arr = collection_obj

            product_collections_arr.forEach(collection => {
                var  collectionobj  = {
                    id: uuidv1(),
                    collection_name: collection.collection_name,
                    product_id: collection.product_id
                }
                product_collections.push(collectionobj);
            }); 

            models.product_collections.bulkCreate(
                product_collections
                  , {individualHooks: true}).then(function(response){
                      console.log('collection success');
                        update_product_styles(product_style_obj)
                })  .catch((error) => {
                         console.log("errorresponse"+error)
                 });
        }
        function update_product_styles(styleobject)
        {
            var product_styles = [];
            var product_styles_arr = styleobject

            product_styles_arr.forEach(style => {
                var  styleobj  = {
                    id: uuidv1(),
                    style_name: style.style_name,
                    product_id: style.product_id
                }
                product_styles.push(styleobj);
            }); 

            models.product_styles.bulkCreate(
                product_styles
                  , {individualHooks: true}).then(function(response){
                      console.log("style success")
                   // update_product_themes(product_theme_obj)

                })  .catch((error) => {
                         console.log("errorresponse"+error)
                 });
        } 
        function update_product_themes(themeobject)
        {
            var product_themes = [];
            var product_themes_arr = themeobject

            product_themes_arr.forEach(theme => {
                console.log(theme.product_id)
                var  gemstoneobj  = {
                    id: uuidv1(),
                    theme_name: theme.theme_name,
                    product_id: theme.product_id
                }
                product_themes.push(gemstoneobj);
            }); 

            models.product_themes.bulkCreate(
                product_themes
                  , {individualHooks: true}).then(function(response){
                    console.log("upload success")

                    //   update_product_sku(product_sku_obj);
                })  .catch((error) => {
                         console.log("errorresponse"+error)
                 });
        } 
       async function update_product_sku(skuobj)
        {
            var product_skus = [];
            var product_skus_description = [];
         var product_sku_arr = skuobj;
   //        var product_sku_arr = splitArray(skuobj, 5000)[3];
          //  var product_sku_arr = splitArray(skuobj, 20000);
           var skuproceecount = 0;
        //   insertsku(skuproceecount);
        // function insertsku(skuproceecount)
        // {
           product_sku_arr.forEach(skuobj => {
       // skuobj = product_sku_arr[0];
                var isdefault = false;
                if(skuobj.isdefault === 'Y')
                {
                    isdefault = true
                }
                var  sku_obj  = {
                    id: uuidv1(),
                    purity: skuobj.purity,
                    metal_color: skuobj.metal_color,
                    generated_sku:skuobj.sku,
                    sku_weight:skuobj.sku_weight,
                    sku_size: skuobj.Ring_Size,
                    product_id:skuobj.product_code,
                    diamond_type:skuobj.diamond_type,
                    isactive:true,
                    isdefault: isdefault
                }
                var sku_description = skuobj.sku_description
                //  var sku_description = product_obj[processed_product_count].product_type +" set in"+skuobj.purity+"K "+skuobj.metal_color+skuobj.sku_weight+ "gm with"
                // if(product_diamonds_obj.length > 0)
                // {
                //     sku_description = sku_description + "Diamonds and"
                // }
                // if(product_gemstones_obj.length > 0)
                // {
                //     sku_description = sku_description + "Gemstones"

                // }
                //   if(skuproceecount >= 4697)
                //    {
                    
                 product_skus.push(sku_obj);
                // }

                var  sku_description_obj  = {
                    id: uuidv1(),
                    sku_id: skuobj.sku,
                    vendor_code: skuobj.metal_color,
                    sku_description:sku_description,
                    vendor_lead_time:skuobj.vendor_leadtime,
                    isactive:true
                }
                //  if(skuproceecount >= 4478)
                //   {
                product_skus_description.push(sku_description_obj);
                //}
                skuproceecount++;
            }); 

            console.log("productskulength"+product_skus.length )

           console.log("productskulength"+product_skus_description.length )
                models.trans_sku_lists.bulkCreate(
                    product_skus
                      , {individualHooks: true}).then(function(response){
                        console.log("porductskusuccess" )

                        models.trans_sku_descriptions.bulkCreate(
                            product_skus_description
                              , {individualHooks: true}).then(function(response){
                                console.log("porductskudescsuccess" )
                                // if(product_sku_arr.length > skuproceecount)
                                // {
                                //     insertsku(skuproceecount);
                                // }else{
                                res.send(200,{message: 'success'})

                                //}

                               
                            })  .catch((error) => {
                                     console.log("errorresponse"+error.message)
                             });
                    })  .catch((error) => {
                             console.log("errorresponse"+error.message)
                     });
                    
           
        //            }

        }
}

exports.getpriceupdatestatus = async (req, res) => {
    var skuwhereclause = {}
    var isfirstime = false;
    var response_message =  ""

    var whereclause1 = {
        isactive : true,
      }
      getwhereclause(req.body)
      function getwhereclause(bodycontent)
      {
        const {req_product_id, vendorcode,category,product_type,metalpurity,product_category,pricingcomponent,purity,sizes,diamondtypes} = bodycontent
       console.log("MMMMM")
        console.log(JSON.stringify(bodycontent))
      if(req_product_id)
      {
        isfirstime = true
        var product_id_arr1 = req_product_id.split(',')
        whereclause1 = {
          product_id : {
            [Op.in]: product_id_arr1
          }
        }
  
  
      }


      let vendor_arr = []

      if(vendorcode && vendorcode.length > 0)
      {
        console.log(JSON.stringify(vendorcode))

        isfirstime = true
        vendorcode.forEach(element => {
          vendor_arr.push(element.shortCode)
        })
       
        whereclause1['vendor_code'] = {
          [Op.in] : vendor_arr
        }
      }

    var pricing_comp = []
      if(pricingcomponent)
      {
        isfirstime = true
        pricingcomponent.forEach(element => {
            pricing_comp.push(element)
        })
      }
  
      let purity_arr = [];

    if(purity && purity.length  > 0)
    {
        isfirstime = true
      metalpurity.forEach(element => {
        purity_arr.push(element.alias)
      })
      skuwhereclause['purity'] = {
        [Op.in] : purity_arr
      }
    }
    let sku_size_arr = []
    if(sizes)
    {
        isfirstime = true
      sizes.forEach(elemet => {
        sku_size_arr.push(elemet.sku_size)
      })
      skuwhereclause['sku_size'] = {
        [Op.in] : sku_size_arr
      }
    }
    let diamond_type_arr = []
    if(diamondtypes)
    {
        isfirstime = true
      diamondtypes.forEach(element => {
        diamond_type_arr.push(element.label)
      })
     
      skuwhereclause['diamond_type'] = {
        [Op.in] : diamond_type_arr
      }
    }
    let product_category_arr = [];

    if(category && category.length > 0)
    {

       
        isfirstime = true
       category.forEach(element => {
        product_category_arr.push(element.name)
      })
      whereclause1['product_category'] = {
        [Op.in] : product_category_arr
      }
    }
   
    let product_type_arr = []
    if(product_type && product_type.length > 0)
    {
        isfirstime = true
       product_type.forEach(element => {
        product_type_arr.push(element.name)
      })
      whereclause1['product_type'] = {
        [Op.in] : product_type_arr
      }
    }
  }

    if(isfirstime)
    {
        
        let table_content = {
          "params": JSON.stringify(req.body)
        }
        await models.price_update_log.create(table_content);
        
    }else
    {
        let lastsearchcontent = await models.price_update_log.findOne({
                                  order: [
                                    ['id', 'DESC'],
                                    
                                   
                                ],
                                limit: 1
                              })

            let products_list=  await models.trans_sku_lists.findAll({
                      attributes: [
   
                           [sequelize.literal('DISTINCT(product_id)'), 'products']
                      ], where: {
                        updatedAt : {
                          [Op.gt] : lastsearchcontent.createdAt
                        }
                      }
                    })
                              console.log(">>>>>>")
        console.log(products_list.length)
         response_message =  products_list.length + " /"

             var gemstones_obj = JSON.parse(lastsearchcontent.params)
             getwhereclause(gemstones_obj)
       

    }

    let products = await models.product_lists.findAll({
       where: whereclause1

    })

    if(response_message.length > 0)
    {
      response_message = response_message +  products.length + " Products"

    }else
    {
      response_message =    products.length + " Products"

    }
    res.status(200).send({status: 200,message:response_message})

}