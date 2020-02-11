
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
            purity: purity_obj.name,
            generated_sku: sku
        }
        product_skus.push(skuobj)
    })
    //res.send(200,{product_skus})

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
                            generated_sku: sku
                            }          
                        product_skus.push(skuobj)
            
                       // product_skus.push(sku)
                        }); 
            })
    var newskus = []
    product_skus.forEach(sku => {
        if(prev_skus.indexOf(sku.generated_sku) === -1)
        {
            newskus.push(sku)
        }
    })

    res.send(200,{newskus})
    // var purityarr = []
   
}

exports.editproduct =  async (req, res) => {
const {createVariants,productId,productName,productDiamondsByProductSku,transSkuListsByProductId} = req.body
var product_object = await models.product_lists.findOne({
    where:{
        product_id : productId
    }
})
processdiamond(0)
async function processdiamond(diamondcount)
{
    let diamondobj = productDiamondsByProductSku[diamondcount]
    let diamondval = await models.product_diamonds.findOne({
        where:{
            diamond_colour: diamondobj.diamondColour,
            diamond_clarity: diamondobj.diamondClarity
        }
    })
    diamondcount = diamondcount + 1


    if(productDiamondsByProductSku.length > diamondcount)
    {
        console.log(JSON.stringify(diamondcount))
        processdiamond(diamondcount)
    }else
    {
        processtranssku()
    }

}

async function processtranssku(skucount)
{
    let skuobj  = transSkuListsByProductId[skucount]

    skucount = skucount + 1

    if(productDiamondsByProductSku.length > skucount)
    {
        console.log(JSON.stringify(skucount))
        processtranssku(skucount)
    }else
    {
      //  processtranssku(skucount)
    }
}


if(transSkuListsByProductId)
{
    console.log(JSON.stringify("hello"+transSkuListsByProductId.length))
    var active_skus = []
    var inactive_skus = []
    transSkuListsByProductId.forEach(async trans_sku =>{
        if(trans_sku.isActive)
        {
            active_skus.push(trans_sku.generateSku)
        }else{
            inactive_skus.push(trans_sku.generateSku)

        }
   

    })

        // let updateactiveskus = await models.trans_sku_lists.update(
        //     { is_active: true },
        //     { where: { generated_sku: {
        //         [Op.in]: active_skus
        //     } } }
        //   )

        //   let updateinactiveskus = await models.trans_sku_lists.update(
        //     { is_active: false },
        //     { where: { generated_sku: {
        //         [Op.in]: inactive_skus
        //     } } }
        //   )
}

if(createVariants)
{
    let varientobj = createVariants[0]
    let metalcolorobj = varientobj.productMetalcoloursByProductId
    if(metalcolorobj)
    {

    }

    let productSizearr = varientobj.productSize
    if(productSizearr)
    {
        
    }

    let purityarr = varientobj.productPuritiesByProductId
    if(purityarr)
    {
        
    }

}




//product_object['product_name'] = "testing"
// await product_object.update({
//     product_name : productName
// })
res.status(200).send(product_object)

}