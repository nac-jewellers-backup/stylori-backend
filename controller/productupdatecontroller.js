
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');

exports.updateproduct = (req, res) => {
   

    var product_json_obj = req.body.Product
    var product_theme_obj = JSON.parse(req.body.Product_theme)
    var product_style_obj = JSON.parse(req.body.Product_style)

    var product_occassions_obj = JSON.parse(req.body.Product_occassion)
    var product_materials_obj = JSON.parse(req.body.Product_material)
    var product_diamonds_obj = JSON.parse(req.body.Product_diamonds)
    var product_gemstones_obj = JSON.parse(req.body.Product_gemstone)
    var product_sku_obj = JSON.parse(req.body.sku)

    var processed_product_count = 0;
    
   
        var product_obj = JSON.parse(product_json_obj)
        updateproduct()
function updateproduct()
{
        var product_model_obj = {
            id : uuidv1(),
            product_id: product_obj[processed_product_count].product_code,
            product_series: processed_product_count,
            isactive: true,
            default_size: product_obj[processed_product_count].default_size,
            default_weight: product_obj[processed_product_count].weight_for_default_size,
            gender:product_obj[processed_product_count].gender,
            height:product_obj[processed_product_count].height,
            width:product_obj[processed_product_count].width,
            length:product_obj[processed_product_count].length,
            product_type: product_obj[processed_product_count].product_type,
            product_vendor_code: product_obj[processed_product_count]['vendor Product Code'],
            vendor_code:product_obj[processed_product_count].Vendor_code,
            isreorderable: true,
            product_name: product_obj[processed_product_count].product_name
        }


        console.log("--======"+JSON.stringify(product_model_obj))
        models.product_lists.create(product_model_obj).then((result) => {
            
        })
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
        function update_product_materials (materialobj)
        {
            var product_material_array = []
            var materials_arr = materialobj;
            materials_arr.forEach(metal => {
                var  metalobj = {
                    id: uuidv1(),
                    material_name: metal.material_name,
                    product_sku: metal.product_code
                }
                product_material_array.push(metalobj);
            }); 

            models.product_materials.bulkCreate(
                product_material_array
                  , {individualHooks: true}).then(function(response){
                     update_product_diamonds(product_diamonds_obj)

                })

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

            models.product_diamonds.bulkCreate(
                product_diamonds
                  , {individualHooks: true}).then(function(response){
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

            models.product_occassions.bulkCreate(
                product_occassions
                  , {individualHooks: true}).then(function(response){
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
                    update_product_themes(product_theme_obj)

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
                    update_product_sku(product_sku_obj);
                })  .catch((error) => {
                         console.log("errorresponse"+error)
                 });
        } 
        function update_product_sku(skuobj)
        {
            var product_skus = [];
            var product_skus_description = [];

            var product_sku_arr = skuobj
            product_sku_arr.forEach(skuobj => {
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
                    product_id:skuobj.product_code,
                    diamond_type:skuobj.diamond_type,
                    isactive:true,
                    isdefault: isdefault
                }
                var sku_description = 'need to be update'
              //  var sku_description = product_obj[processed_product_count].product_type +" set in"+skuobj.purity+"K "+skuobj.metal_color+skuobj.sku_weight+ "gm with"
                if(product_diamonds_obj.length > 0)
                {
                    sku_description = sku_description + "Diamonds and"
                }
                if(product_gemstones_obj.length > 0)
                {
                    sku_description = sku_description + "Gemstones"

                }
                product_skus.push(sku_obj);

                var  sku_description_obj  = {
                    id: uuidv1(),
                    sku_id: skuobj.sku,
                    vendor_code: skuobj.metal_color,
                    sku_description:sku_description,
                    vendor_lead_time:skuobj.vendor_leadtime,
                    isactive:true
                }
                product_skus_description.push(sku_description_obj);
            }); 

           console.log("productskulength"+product_skus.length )
                models.trans_sku_lists.bulkCreate(
                    product_skus
                      , {individualHooks: true}).then(function(response){
                        models.trans_sku_descriptions.bulkCreate(
                            product_skus_description
                              , {individualHooks: true}).then(function(response){
                                res.send(200,{message: 'success'})

                               
                            })  .catch((error) => {
                                     console.log("errorresponse"+error)
                             });
                    })  .catch((error) => {
                             console.log("errorresponse"+error)
                     });
           
           

        }
}