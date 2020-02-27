
const models=require('./../models');
import 'dotenv/config';
var request = require('request');

const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
exports.priceupdate =  async (req, res) => {
    request({
        url: 'http://localhost:8000/updatepricelist',
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({req_product_id : 'SR3261'})
    }, function(error, response, body) {
       console.log(body)
    });

}

exports.ringpriceupdate =  async (req, res) => {
   // const {skuprice} = req.body;
   let skus_arr = req.body;
    console.log(JSON.stringify(req.body.length));
    processskuprice(0)
   async function processskuprice(indexval)
    {
        let processsku = skus_arr[indexval]
      await  models.trans_sku_lists.update(
            { discount_price : processsku.discount_price },
            { where: { generated_sku : processsku.sku } }
          )
          indexval = indexval + 1 
          if(skus_arr.length > indexval)
          {
          processskuprice(indexval)
          }else{
              res.send(200,{"message":"success"})
          }

    }

}



exports.productupload =  async (req, res) => {
    var apidata = req.body;
    var product_skus = [];
    var skuurl = ""
    console.log(JSON.stringify(apidata))
    var categoryobj = apidata.product_categoy;
    var categoryval = categoryobj.charAt(0)
    var producttypeobj = apidata.product_type;
    var producttypeval = producttypeobj.shortCode;
    var seriesvalue = apidata.startcode + 1;
    console.log("i am here")
    console.log(seriesvalue)
    skuurl = categoryobj;
    if(Number.isNaN(seriesvalue))
    {
        console.log("i am here")
        seriesvalue = 3000
    }
    if(categoryobj !== producttypeobj.name)
    {
        skuurl = skuurl+"/"+producttypeobj.name
    }
   

  let final_series = await models.product_lists.findOne({
         
        order: [
            ['product_series', 'DESC']
        ],
        attributes: ['product_series']
    });
    var product_series = 3001;
    if(final_series)
    {
        product_series = final_series.product_series + 1
    }
    var product_id = "S"+producttypeval+(product_series);

    var skuprefix = "S"+producttypeval+product_series+"-";

    var product_name = apidata.productname;
    var product_category = apidata.product_categoy;
    var product_type = apidata.product_type.name;
    var gender = apidata.selectedgender;
    var vendorname = apidata.vendorcode.name;
    var vendor_code = apidata.vendorcode.shortCode;
    var product_series = product_series;
    var height = apidata.metal_height;
    var width = apidata.metal_width;
    var length = apidata.metal_length;
    var productsizes = apidata.selected_sizes;
    var productcolors = apidata.metalcolour;
    var productpurity = apidata.metalpurity;
    var isreorderable = apidata.isreorderable;
    var product_vendor_code = apidata.productvendorcode;
    var default_size = apidata.default_size;
    var default_metal_color = apidata.default_metal_colour;
    var default_metal_purity = apidata.default_metal_purity
    var materials = apidata.material_names;
    var default_metal_size = apidata.default_size;
    var stonecolour_lists = apidata.stonecolour;
    var stonecount_lists = apidata.stonecount;

    
    var product_images = apidata.product_images;
    var size_varient = '';

    if(productsizes)
    {
      
        size_varient = productsizes.join(',');
    }

   var default_weight = 4;


    var isreorderable = false;
    if(apidata.isreorderable === 'Yes')
    {
        isreorderable = true
    }
    var colour_varient = '';
    var diamondlist = [];
    var gemstonelist = [];
    var product_collections = apidata.collections;
    var product_occassions = apidata.occassions;
    var product_themes = apidata.themes;
    var product_styles = apidata.prod_styles;

    var metals = apidata.metals;

    metals.forEach(element => {
        if(element.metalname === 'Diamond')
        {
            diamondlist.push(element)
        }
        if(element.metalname === 'Gemstone')
        {
            gemstonelist.push(element)
        }
    });
    

    
    if(productcolors && productpurity)
    {
        var colorarr = [];
        productpurity.forEach(purityelement => {

           
            productcolors.forEach(colorelement => {
                colorarr.push(purityelement.name+' '+colorelement.name);
            });
        });
        colour_varient = colorarr.join(',');
   
    }

    var product_obj = {
        id: uuidv1(),
        product_id,
        product_series,
        vendor_code,
        product_name,
        product_category,
        isactive: false,
        default_weight,
        gender,
        height,
        width,
        length,
        product_type,
        product_vendor_code,
        default_size,
        size_varient,
        colour_varient,
        isreorderable,
        createdAt:new Date(),
        updatedAt: new Date()

    }


    let successmessage = await models.product_lists.create(product_obj)
  /*************** images list ********************/
   var prod_images = [];
    if(Object.keys(product_images))
    {
        Object.keys(product_images).forEach(key => {
           let images_arr = product_images[key]
           images_arr.forEach(element => {
            let ishover = false
           let isdefault = false
        
           if(default_metal_color === element.color && element.position == 1)
           {
            ishover = true
           }
           if(default_metal_color === element.color && element.position == 1)
           {
            isdefault = true
           }
            var image_obj = {
                id: uuidv1(),
                product_id : successmessage.product_id,
                product_color:element.color,
                image_url: element.image_url,
                image_position: element.position,
                ishover,
                isdefault

            }
            prod_images.push(image_obj)
           })
            
        })
        console.log(JSON.stringify(prod_images))
        await models.product_images.bulkCreate(
            prod_images, {individualHooks: true})
    }
    /*************** add gender ********************/
    if(gender)
    {
        
        
            const genderobj = {
                id:uuidv1(),
                gender_name: gender,
                product_id: product_obj.product_id,
                is_active: true
            }
            await models.product_gender.create(genderobj)
       
    }

  /*************** purity list ********************/
    var puritylist = apidata.metalpurity;
    var purityarr = []
      puritylist.forEach(purity => {

            const purityobj = {
                id: uuidv1(),
                purity: purity.name,
                product_id : product_obj.product_id,
                is_active : true
            }
            purityarr.push(purityobj)
            var sku = skuprefix + purity.shortCode 
            var skuobj = {
                product_id: successmessage.product_id,
                product_type: producttypeval,
                service_name: vendorname,
                product_series: seriesvalue,
                purity: purity.name,
                generated_sku: sku
            }
            product_skus.push(skuobj)
        });
        if(puritylist)
        {
            await models.product_purities.bulkCreate(
                purityarr, {individualHooks: true})
        }
        console.log("puritylistcount")
        console.log(product_skus.length)
        /************ product stone colour */
        var stonecolourarr = []

        if(stonecolour_lists)
        {
            stonecolour_lists.forEach(stonecolourobj => {
                const stone_colour_obj = {
                    id:uuidv1(),
                    stonecolor: stonecolourobj,
                    product_id: product_obj.product_id,
                    is_active : true
                }
                stonecolourarr.push(stone_colour_obj);
            })
            
            await models.product_stonecolor.bulkCreate(
                stonecolourarr, {individualHooks: true})
        }
        /******************************** */
        

        /************ product stone count */
        var stonecountsarr = []

        if(stonecount_lists)
        {
            stonecount_lists.forEach(stonecountobj => {
                const stone_count_obj = {
                    id:uuidv1(),
                    stonecount: stonecountobj,
                    product_id: product_obj.product_id,
                    is_active : true
                }
                stonecountsarr.push(stone_count_obj);
            })
            
            await models.product_stonecount.bulkCreate(
                stonecountsarr, {individualHooks: true})
        }
        /******************************** */
        
        
        var collection_arr = [];
        if(product_collections)
        {
            product_collections.forEach(collectonobj => {
                const collection = {
                    id:uuidv1(),
                    collection_name: collectonobj,
                    product_id: product_obj.product_id
                }
                collection_arr.push(collection);
            })
            
            await models.product_collections.bulkCreate(
                collection_arr, {individualHooks: true})
        }

        var occassions_arr = [];
        if(product_occassions)
        {
            product_occassions.forEach(occassionsobj => {
                const occassion = {
                    id:uuidv1(),
                    occassion_name: occassionsobj,
                    product_id: product_obj.product_id
                }
                occassions_arr.push(occassion);

            })
            await models.product_occassions.bulkCreate(
               occassions_arr, {individualHooks: true})
        }

        var styles_arr = [];
        if(product_styles)
        {
            product_styles.forEach(styleobj => {
                const style = {
                    id:uuidv1(),
                    style_name: styleobj,
                    product_id: product_obj.product_id
                }
                styles_arr.push(style);

            })
            await models.product_styles.bulkCreate(
                styles_arr, {individualHooks: true})
        }


        var themes_arr = [];
        if(product_themes)
        {
            product_themes.forEach(themeobj => {
                const style = {
                    id:uuidv1(),
                    theme_name: themeobj,
                    product_id: product_obj.product_id,
                    is_active: true
                }
                themes_arr.push(style);

            })
            await models.product_themes.bulkCreate(
                themes_arr, {individualHooks: true})
        }

        var material_arr = [];
        if(materials)
        {
        materials.forEach(materialobj => {
            const metal_obj = {
                id: uuidv1(),
                material_name: materialobj,
                product_sku: product_obj.product_id
            }
            material_arr.push(metal_obj)
        })
        await models.product_materials.bulkCreate(
            material_arr, {individualHooks: true})

          if(materials.indexOf('Diamond') > -1)
          {
            skuurl = skuurl+'/'+'Diamond'
          }else  if(materials.indexOf('Gemstone') > -1)
          {
            skuurl = skuurl+'/'+'Gemstone'
          }else{
            skuurl = skuurl+'/'+materials[0]
          }
        }

    

      var skus = product_skus;

        product_skus = [];
      var metalcolorlist = apidata.metalcolour;

          /*************** add metalcolor ********************/

      var metal_color_arr =[]
      if(metalcolorlist)  
      {
      metalcolorlist.forEach(metalcolorobj => {
        const colorobj = {
            id:uuidv1(),
            product_color: metalcolorobj.name,
            product_id: product_obj.product_id,
            is_active: true
        }
        metal_color_arr.push(colorobj);

    })
    await models.product_metalcolours.bulkCreate(
        metal_color_arr, {individualHooks: true})
    }
    /****************** */

        skus.forEach(skuvalue => {
            var  skuval = skuvalue.generated_sku

            metalcolorlist.forEach(metalcolor => {

                var sku = skuval + metalcolor.shortCode 
               
                var skuobj = 
                {
                ...skuvalue,
                generated_sku: sku,
                metal_color:metalcolor.name
                }
                product_skus.push(skuobj)


            });
        }); 
        console.log("metalcolorlistcount")
        console.log(product_skus.length)

/*************** Diamond Lists ********************/
       var skus = product_skus;

        product_skus = [];
        var diamond_sku_clarity = {}
        let diamondtype = await models.master_diamond_types.findAll({
         });
         diamondtype.forEach(diamond_type => {
            var claritytype = diamond_type.diamond_color +'-'+diamond_type.diamond_clarity
            diamond_sku_clarity[claritytype] = diamond_type.short_code
        })
        var diamondsarr = []
        diamondlist.forEach( diamond => {
            var clarity =  diamond.clarity.name +'-'+diamond.color.shortCode  

            const diamonval = {
                id : uuidv1(),
                diamond_colour : diamond.color.shortCode,
                diamond_clarity : diamond.clarity.name,
                diamond_settings : diamond.settings.name,
                diamond_shape : diamond.shape.name,
                stone_count : diamond.count,
                dimaond_type : clarity,
                stone_weight : diamond.weight,
                product_sku: product_obj.product_id
            }
            diamondsarr.push(diamonval)
        })
        skus.forEach(skuvalue => {
            var  skuval = skuvalue.generated_sku

            diamondlist.forEach(diamond => {
              var clarity =  diamond.clarity.name +'-'+diamond.color.shortCode  
              
              var sku = skuval + diamond_sku_clarity[clarity]
                
              var skuobj = 
                {
                ...skuvalue,
                generated_sku: sku,
                diamond_color:diamond.color.shortCode,
                diamond_type: clarity
                }
                product_skus.push(skuobj)
            });
        });
        if( product_skus.length == 0)
        {
            product_skus = skus
        }
      await models.product_diamonds.bulkCreate(
               diamondsarr, {individualHooks: true})
               console.log("diamndlistcount")
               console.log(product_skus.length)
       
/*************** gemstone Lists ********************/

       skus = product_skus;
       var gemstonearr =[]
        var gemstonesku = ""; 
        var gemstonecolorcode1 = "00"; 
        var gemstonecolorcode2 = "00"; 
        var gemstoneshortcode = "00"; 
        var gemstonecolorcode2 = "00"; 
        gemstonelist.forEach(gem =>{
            const gemstone_obj = {
                id: uuidv1(),
                gemstone_type : gem.clarity.name,
                gemstone_shape: gem.color.name,
                gemstone_setting: gem.settings.name,
                gemstone_size: gem.shape,
                stone_count: gem.count,
                stone_weight: gem.weight,
                product_sku: product_obj.product_id

            }

            gemstonearr.push(gemstone_obj)
        })
      
        await models.product_gemstones.bulkCreate(
        gemstonearr, {individualHooks: true})
        if(gemstonelist.length > 0)
        {
            var firstgemobj = gemstonelist[0];
            gemstoneshortcode =   firstgemobj.clarity.shortCode;
            gemstonesku = firstgemobj.clarity.colorCode;
            gemstonecolorcode1 = firstgemobj.clarity.colorCode
        }
        if(gemstonelist.length > 1)
        {
            var secondgemobj = gemstonelist[1];

            gemstonesku = gemstonesku+secondgemobj.clarity.colorCode;
            gemstonecolorcode2 = secondgemobj.clarity.colorCode;
        }
        
        product_skus = [];
        skus.forEach(skuvalue => {
            var sku = skuvalue.generated_sku+ gemstonecolorcode1 + gemstonecolorcode2
           
            var skuobj = 
                {
                ...skuvalue,
                generated_sku: sku
                }          
            product_skus.push(skuobj)

           // product_skus.push(sku)
            }); 
            console.log("gemslistcount")
            console.log(product_skus.length)
            if( product_skus.length == 0)
            {
                product_skus = skus
            }
    /*************** Size Lists ********************/
   
       skus = product_skus;
        product_skus = [];
        var sizelist = apidata.selected_sizes;
        console.log(sizelist.length)
        skus.forEach(skuvalue => {
            sizelist.forEach(sizevalue => {
                var sku = skuvalue.generated_sku+"_"+ sizevalue
               
                 var skuobj = 
                 {
                 ...skuvalue,
                 generated_sku: sku,
                 sku_size: sizevalue
                 } 
                product_skus.push(skuobj)
            });
        });
        if( product_skus.length == 0)
        {
            product_skus = skus
        }
        console.log("size"+product_skus.length)
        console.log("sizelistcount")
        console.log(product_skus.length)

       var  uploadskus = []
       var uploaddescriptions = []
       product_skus.forEach(prodkt => {
                var isdefault = false
                var sku_weight = default_weight;

                if(prodkt.metal_color === default_metal_color && prodkt.purity === default_metal_purity && prodkt.sku_size === default_metal_size)
                {
                    isdefault = true;
                }

                console
                const sizedifferent =   prodkt.sku_size - default_metal_size;
                
                sku_weight =  parseFloat(sku_weight) + parseFloat((sizedifferent * 0.1))
                
                const sku_desc = {
                    id: uuidv1(),
                    sku_id: prodkt.generated_sku,
                    vendor_code: vendor_code,
                    sku_description : "Earrings set in 18 Kt Yellow Gold 3.45 gm with Diamonds (0.19 ct, IJ - SI )"
                }
                var prod_obj = {
                    ...prodkt,
                    id: uuidv1(),
                    isdefault,
                    sku_weight
                }
                     uploaddescriptions.push(sku_desc)
                    uploadskus.push(prod_obj)

                
        });

     //   res.send(200,{count:product_skus.length});

    //        var productlist = [
    //         product_skus[0],
    //         product_skus[1]
    //     ]


  //  res.json(product_skus);
         models.trans_sku_lists.bulkCreate(
            uploadskus
              , {individualHooks: true}).then(function(response){
                models.trans_sku_descriptions.bulkCreate(
                    uploaddescriptions
                      , {individualHooks: true}).then(function(response){ // Notice: There are no arguments here, as of right now you'll have to...
                    //   request({
                    //     url: 'htts://api.stylori.net/updatepricelist',
                    //     method: "POST",
                    //     headers: {"Content-Type": "application/json"},
                    //     body: JSON.stringify({req_product_id : product_id})
                    // }, function(error, response, body) {
                    //    console.log(body)
                    //    console.log(response)

                    // });
                    res.json(uploadskus);

                    })
                
               
              })
              
            //  res.send(200, { submitted: true })
       
    

}
exports.getproductvarient =  async (req, res) => {
    const {productPuritiesByProductId, productDiamondTypes,productSize,productId,productMetalcoloursByProductId} = req.body
  var product_skus = []
  var prev_skus = [];
  var skus = product_skus;
  var skuprefix =  productId+'-';
     product_skus = [];
    var product_object = await models.product_lists.findOne({
        attributes:["product_id","size_varient","product_type","vendor_code"],
        include:[{
            model: models.trans_sku_lists,
            attributes:['generated_sku']
        },
        {
            model:models.product_purities
        },
        {
            model:models.product_diamonds,
            attributes:["diamond_type"],
            group:["diamond_type"]
        },
        {
            model:models.product_metalcolours
        },
        {
            model:models.product_gemstones
        }],
        where:{
            product_id : productId
        }
    })

    product_object.trans_sku_lists.forEach(skuid => {
        prev_skus.push(skuid.generated_sku)
    })

    let diamonds 

    let purityobj = {}
    let masterpurity = await models.master_metals_purities.findAll()
    masterpurity.forEach(purity => {
        purityobj[purity.name] = purity.short_code
    })
    /****************puritylis */
    var purities = productPuritiesByProductId
    var puritylist = product_object.product_purities;
    var purityarr = []
    puritylist.forEach(purity => {
        var sku = skuprefix + purityobj[purity.purity]
        var skuobj = {
            product_id: productId,
            product_type: product_object.product_type,
            service_name: product_object.vendor_code,
            product_series: 0,
            purity: purity.purity,
            generated_sku: sku
        }
        product_skus.push(skuobj)
    })
    purities.forEach(purity_obj =>{
        var sku = skuprefix + purityobj[purity_obj.name]
        var skuobj = {
            product_id: productId,
            product_type: product_object.product_type,
            service_name: product_object.vendor_code,
            product_series: 0,
            sku_weight: purity_obj.metal_weight,
            purity: purity_obj.name,
            generated_sku: sku
        }
        product_skus.push(skuobj)
    })

    /************************** */


    /****************metalcolor list */

    var colorlist = productMetalcoloursByProductId
    var skus = product_skus;

    product_skus = [];
    let colorobj = {}
    let mastercolors = await models.master_metals_colors.findAll()
    mastercolors.forEach(color => {
        colorobj[color.name] = color.short_code
    })
  var metalcolorlist = product_object.product_metalcolours;
  console.log("colorlist"+metalcolorlist.length)
  
    skus.forEach(skuvalue => {
        var  skuval = skuvalue.generated_sku

        metalcolorlist.forEach(metalcolor => {

            var sku = skuval + colorobj[metalcolor.product_color]
           
            var skuobj = 
            {
            ...skuvalue,
            generated_sku: sku,
            metal_color:metalcolor.product_color 
            }
            product_skus.push(skuobj)


        });

        colorlist.forEach(color => {

            var sku = skuval + colorobj[color.name]
           
            var skuobj = 
            {
            ...skuvalue,
            generated_sku: sku,
            metal_color:color.name 
            }
            product_skus.push(skuobj)


        });
    }); 

     /************************ */
     /*****************Diamond list */
     var diamonds_arr = productDiamondTypes
    var skus = product_skus;
    var diamondlist = product_object.product_diamonds
    if(diamondlist.length > 0)
    {
        product_skus = [];

    }
    console.log("diamondlength"+diamondlist.length)
    var diamond_sku_clarity = {}
    let diamondtype = await models.master_diamond_types.findAll({
     });
     diamondtype.forEach(diamond_type => {
        var claritytype = diamond_type.diamond_color+diamond_type.diamond_clarity
        diamond_sku_clarity[claritytype] = diamond_type.short_code
    })
    var diamondsarr = []

    skus.forEach(skuvalue => {
        var  skuval = skuvalue.generated_sku
        console.log(JSON.stringify(diamondlist))
        //diamond.diamond_type
        diamondlist.forEach(diamond => {
          var clarity =  diamond.diamond_type
          console.log("claritycolor"+JSON.stringify(diamond))
          var sku = skuval + diamond_sku_clarity[clarity]
            
          var skuobj = 
            {
            ...skuvalue,
            generated_sku: sku,
            diamond_color:diamond.diamond_type,
            diamond_type: clarity
            }
            product_skus.push(skuobj)
        });
        res.send(200,{product_skus})

        diamonds_arr.forEach(diamond => {
//            var clarity = diamond.diamondType
            var clarity =  diamond.diamondColor+diamond.diamondClarity
            console.log("diamondvarient"+clarity)
            var sku = skuval + diamond_sku_clarity[clarity]
            console.log("diamondvarient"+sku)

            var skuobj = 
              {
              ...skuvalue,
              generated_sku: sku,
              diamond_color:clarity,
              diamond_type: clarity
              }
              product_skus.push(skuobj)
          });
    });
    /********************* */
    console.log("product_skusvarient"+JSON.stringify(product_skus))

//     /**************gemstonelist ***********/
    var gemstonecolorcode1 = "00"; 
    var gemstonecolorcode2 = "00"; 
    /************************************ */
    skus = product_skus
    product_skus = [];
        skus.forEach(skuvalue => {
            var sku = skuvalue.generated_sku+ gemstonecolorcode1 + gemstonecolorcode2
           
            var skuobj = 
                {
                ...skuvalue,
                generated_sku: sku
                }          
            product_skus.push(skuobj)

           // product_skus.push(sku)
            }); 
            skus = product_skus
            product_skus = [];
            var size_arr = productSize;
            var sizes = []
            if(product_object.size_varient)
            {
             sizes = product_object.size_varient.split(',')
            }
            
                skus.forEach(skuvalue => {
                    sizes.forEach(sizeval => {
                    var sku = skuvalue.generated_sku+"-"+sizeval
                   
                    var skuobj = 
                        {
                        ...skuvalue,
                        sku_size:sizeval,
                        generated_sku: sku
                        }          
                    product_skus.push(skuobj)
        
                   // product_skus.push(sku)
                    }); 
                    size_arr.forEach(sizeval => {
                        var sku = skuvalue.generated_sku +"-"+sizeval
                       
                        var skuobj = 
                            {
                            ...skuvalue,
                            is_active: true,
                            generated_sku: sku,
                            sku_size:sizevalue
                            }          
                        product_skus.push(skuobj)
            
                       // product_skus.push(sku)
                        }); 
            })
            if(product_skus.length == 0)
            {
               product_skus = skus 
            }
    var newskus = []
    product_skus.forEach(sku => {
        if(prev_skus.indexOf(sku.generated_sku) === -1)
        {
            var skuobj = 
            {
                productId: sku.product_id,
                productType: sku.product_type,
                diamondType: sku.dimaond_type,
                metalColor: sku.metal_color,
                generatedSku: sku.generated_sku,
                purity: sku.purity,
                skuSize: sku.sku_size,
                isActive: true
            }          
            newskus.push(skuobj)
        }
    })
   
    //res.send(200,{newskus})
    // var purityarr = []
   
}
exports.editproductdiamond =  async (req, res) => {
    const {diamondid,diamondSettings,diamondShape,stoneCount,stoneWeight} = req.body
    console.log(diamondid)
    let response_obj1 = await models.product_diamonds.update(
        // Values to update
        {
            diamond_settings: diamondSettings,
            diamond_shape : diamondShape,
            stone_count : stoneCount,
            stone_weight : stoneWeight
        },
        { // Clause
            where: 
            {
              id: diamondid
            }
        })
        if(response_obj1[0] > 0)
        {
            res.send(200,{"message": "success"})

        }else{
            res.send(402,{"message": "Try again later"})

        }
}
exports.updateskuinfo =  async (req, res) => {
    const {generatedSku, vendorDeliveryTime, isdefault, isActive, isReadyToShip} = req.body
    let response_obj1 = await models.trans_sku_lists.update(
        // Values to update
        {
            vendor_delivery_time: vendorDeliveryTime,
            isdefault : isdefault,
            is_active : isActive,
            is_ready_to_ship : isReadyToShip
        },
        { // Clause
            where: 
            {
              generated_sku: generatedSku
            }
        })
        if(response_obj1[0] > 0)
        {
            res.send(200,{"message": "success"})

        }else{
            res.send(402,{"message": "Try again later"})

        }


}

exports.editproduct =  async (req, res) => {
const {productId,productName,themes,styles,occassions,collections,stonecount,stonecolour,gender} = req.body


var product_object = await models.product_lists.findOne({
    include:[
        {
            model: models.product_themes,
            attributes: ['theme_name'],
        },
        {
            model: models.product_styles,
            attributes: ['style_name'],
        },
        {
            model: models.product_occassions,
            attributes: ['occassion_name'],
        },
        {
            model: models.product_collections,
            attributes: ['collection_name'],
        },
        {
            model: models.product_stonecount,
            attributes: ['stonecount'],
        },
        {
            model: models.product_stonecolor,
            attributes: ['stonecolor'],
        },
        {
            model: models.product_gender,
            attributes: ['gender_name'],
        }

    ],
    where:{
        product_id : productId
    }
})
let product_themes =  product_object.product_themes;
let product_styles = product_object.product_styles;
let product_occassions = product_object.product_occassions;
let product_collections = product_object.product_collections;
let product_stones = product_object.product_stonecounts;
let product_stonecolor = product_object.product_stonecolors;
let product_gender = product_object.product_genders;

        

            await models.product_themes.update(
            {
                is_active:  false
            },
            { 
                where: 
                {
                  product_id: productId
                }
            })

            await models.product_occassions.update(
                // Values to update
                {
                    is_active:  false
                },
                { // Clause
                    where: 
                    {
                      product_id: productId
                    }
            })

            await models.product_collections.update(
                // Values to update
                {
                    is_active:  false
                },
                { // Clause
                    where: 
                    {
                      product_id: productId
                    }
            })
            await models.product_styles.update(
            // Values to update
            {
                is_active:  false
            },
            { // Clause
                where: 
                {
                    product_id: productId
                }
            })

        
        
        
                let prev_themes = []
                let prev_styles = []
                let prev_occassions = []
                let prev_collections = []
                let prev_stones = []
                let prev_stonecolors = []
                let prev_genders = []
        product_themes.forEach(element => {
            prev_themes.push(element.theme_name)
        })
        product_occassions.forEach(element => {
            prev_occassions.push(element.occassion_name)
        })
        product_styles.forEach(element => {
            prev_styles.push(element.style_name)
        })

        product_collections.forEach(element => {
            prev_collections.push(element.collection_name)
        })

        product_stones.forEach(element => {
            prev_stones.push(element.stonecount)
        })
        product_stonecolor.forEach(element => {
            prev_stonecolors.push(element.stonecolor)
        })

        product_gender.forEach(element => {
            prev_genders.push(element.gender_name)
        })
        
        let theme_names = [];
        themes.forEach(element => {
            if(prev_themes.indexOf(element.themeName) === -1)
            {
                    var goldobj_val = {
                        id: uuidv1(),
                        product_id: productId,
                        theme_name:element.themeName,
                        is_active: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                    theme_names.push(goldobj_val)
            }            
        })

        let occassion_names = [];
        occassions.forEach(element => {
            if(prev_occassions.indexOf(element.occassionName) === -1)
            {
                    var goldobj_val = {
                        id: uuidv1(),
                        product_id: productId,
                        occassion_name:element.occassionName,
                        is_active: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                    occassion_names.push(goldobj_val)
            }            
        })

        await models.product_occassions.bulkCreate(
            occassion_names
              , {individualHooks: true})


              let collection_names = [];
              collections.forEach(element => {
                  if(prev_collections.indexOf(element.collectionName) === -1)
                  {
                          var goldobj_val = {
                              id: uuidv1(),
                              product_id: productId,
                              collection_name:element.collectionName,
                              is_active: true,
                              createdAt: new Date(),
                              updatedAt: new Date()
                          }
                          collection_names.push(goldobj_val)
                  }            
              })
      
              await models.product_collections.bulkCreate(
                collection_names
                    , {individualHooks: true})

        let stone_counts = [];
        stonecount.forEach(element => {
            if(prev_stones.indexOf(element.stonecount) === -1)
            {
                    var goldobj_val = {
                        id: uuidv1(),
                        product_id: productId,
                        stonecount:element.stonecount,
                        is_active: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                    stone_counts.push(goldobj_val)
            }            
        })
        await models.product_stonecount.bulkCreate(
            stone_counts
                , {individualHooks: true})
      
      
                let stone_colors = [];
                stonecolour.forEach(element => {
                    if(prev_stonecolors.indexOf(element.stonecolor) === -1)
                    {
                            var goldobj_val = {
                                id: uuidv1(),
                                product_id: productId,
                                stonecolor:element.stonecolor,
                                is_active: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                            stone_colors.push(goldobj_val)
                    }            
                })

                await models.product_stonecolor.bulkCreate(
                    stone_colors
                        , {individualHooks: true})

        let gender_names = [];    
        let genders_arr = [] ;
        gender.forEach(element => {
            genders_arr.push(element.label)
            if(prev_genders.indexOf(element.label) === -1)
            {
                    var goldobj_val = {
                        id: uuidv1(),
                        product_id: productId,
                        gender_name:element.label,
                        is_active: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                    gender_names.push(goldobj_val)
            }            
        })     
        
        await models.product_gender.bulkCreate(
            gender_names
              , {individualHooks: true})  
         let style_names = [];
        styles.forEach(element => {
            if(prev_styles.indexOf(element.styleName) === -1)
            {
                    var goldobj_val = {
                        id: uuidv1(),
                        product_id: productId,
                        style_name:element.styleName,
                        is_active: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                    style_names.push(goldobj_val)
            }            
        })
        await models.product_styles.bulkCreate(
            style_names
              , {individualHooks: true})

              await models.product_lists.update(
                // Values to update
                {
                    product_name:  productName,
                    gender : genders_arr.join()
                },
                { // Clause
                    where: 
                    {
                      product_id: productId
                    }
                })
        







//product_object['product_name'] = "testing"
// await product_object.update({
//     product_name : productName
// })
res.status(200).send(prev_genders )

}