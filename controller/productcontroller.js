
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');

exports.productupload =  async (req, res) => {
    var apidata = req.body;
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
    var product_id = "S"+producttypeval+(final_series.product_series+1);

    var skuprefix = "S"+producttypeval+final_series.product_series+"-";
    var vendorname = apidata.vendor.name;
    var vendor_code = apidata.vendor.shortCode;
    var product_series = final_series.product_series + 1;
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
    var product_vendor_code = apidata.productvendorcode
    var size_varient = '';
    var colour_varient = '';
    var diamondlist = [];
    var gemstonelist = [];
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



/*************** gemstone Lists ********************/

       skus = product_skus;
        var gemstonesku = ""; 
        var gemstonecolorcode1 = "00"; 
        var gemstonecolorcode2 = "00"; 
        var gemstoneshortcode = "00"; 
        var gemstonecolorcode2 = "00"; 
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
        if(gemstonelist.length > 0)
        {
        product_skus = [];
        skus.forEach(skuvalue => {
            var sku = skuvalue.generated_sku+ gemstonecolorcode1 + gemstonecolorcode2
            var skuobj = 
                {
                ...skuvalue,
                generated_sku: sku,
                gemstone_a:gemstoneshortcode
                }          
            product_skus.push(skuobj)
           // product_skus.push(sku)
            }); 
        }

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
                 generated_sku: sku
                 } 
                product_skus.push(skuobj)
            });
        });

        console.log("size"+product_skus.length)
       var  uploadskus = []
        product_skus.forEach(prodkt => {
                var prod_obj = {
                    ...prodkt,
                    id: uuidv1()
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
                res.json(product_skus);
              })
            //  res.send(200, { submitted: true })
        // models.trans_sku_descriptions.create(
        //     {id:uuidv1(), sku_id: 'b73216a0-c95f-11e9-8ee8-a9d9fbea3b2a'}
        //   ).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
        //     console.log("created");
        //   })
    

}