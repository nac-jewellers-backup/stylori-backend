
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
    console.log(JSON.stringify(apidata));
    var product_skus = [];
    var categoryobj = apidata.product_categoy;
    var categoryval = categoryobj.name.charAt(0)
    var producttypeobj = apidata.product_type;
    var producttypeval = producttypeobj.shortCode;
    var seriesvalue = apidata.startcode + 1;
     

   

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
    var vendorname = apidata.vendor.name;
    var vendor_code = apidata.vendor.shortCode;
    var product_series = product_series;
    var product_name = apidata.productname;
    var default_weight = apidata.metal_weight;
    var height = apidata.metal_height;
    var width = apidata.metal_width;
    var length = apidata.metal_length;
    var gender = apidata.gender.name;
    var product_type = apidata.product_type.name;
    var productsizes = apidata.size;
    var productcolors = apidata.metal_color;
    var productpurity = apidata.purity;
    var isreorderable = apidata.isreorderable;
    var product_vendor_code = apidata.productvendorcode;
    var default_size = apidata.defaultsize;
    var default_metal_size = apidata.defaultmetalsize.value;
    var default_metal_color = apidata.default_metal_color.name;
    var default_metal_purity = apidata.default_metal_purity.name
    var size_varient = '';
    var colour_varient = '';
    var diamondlist = [];
    var gemstonelist = [];
    var metals = apidata.metals;
    var materials = apidata.materials.material;
    var product_collections = apidata.collections;
    var product_occassions = apidata.occassions;
    var product_themes = apidata.themes;
    var product_styles = apidata.style;

    
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
    

    if(productsizes)
    {
        var sizearr = [];
        productsizes.forEach(element => {
            sizearr.push(element.value);
        });
        size_varient = sizearr.join(',');
    }
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
        isactive: true,
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
        isreorderable

    }

   

    let successmessage = await models.product_lists.create(product_obj)
    /*************** purity list ********************/
        var puritylist = apidata.purity;
        puritylist.forEach(purity => {
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

        var collection_arr = [];
        if(product_collections)
        {
            product_collections.forEach(collectonobj => {
                const collection = {
                    id:uuidv1(),
                    collection_name: collectonobj.name,
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
                    occassion_name: occassionsobj.name,
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
                    style_name: styleobj.name,
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
                    style_name: themeobj.name,
                    product_id: product_obj.product_id
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
                material_name: materialobj.name,
                product_sku: product_obj.product_id
            }
            material_arr.push(metal_obj)
        })
        await models.product_materials.bulkCreate(
            material_arr, {individualHooks: true})
        }

        var skus = product_skus;
        product_skus = [];
        var metalcolorlist = apidata.metal_color;

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

       await models.product_diamonds.bulkCreate(
                diamondsarr, {individualHooks: true})

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
        
    /*************** Size Lists ********************/
   
       skus = product_skus;
        product_skus = [];
        var sizelist = apidata.size;
        console.log(sizelist.length)
        skus.forEach(skuvalue => {
            sizelist.forEach(sizevalue => {
                var sku = skuvalue.generated_sku+"_"+ sizevalue.value
               
                 var skuobj = 
                 {
                 ...skuvalue,
                 generated_sku: sku,
                 sku_size: sizevalue.value
                 } 
                product_skus.push(skuobj)
            });
        });

        console.log("size"+product_skus.length)
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
                request({
                    url: '/updatepricelist',
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({req_product_id : 'SR3261'})
                }, function(error, response, body) {
                   console.log(body)
                });
                res.json(uploadskus);
              })
              
            //  res.send(200, { submitted: true })
        // models.trans_sku_descriptions.create(
        //     {id:uuidv1(), sku_id: 'b73216a0-c95f-11e9-8ee8-a9d9fbea3b2a'}
        //   ).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
        //     console.log("created");
        //   })
    

}