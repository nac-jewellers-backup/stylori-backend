
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');

exports.productupload = (req, res) => {
    var product_skus = [];
    var categoryobj = apidata.product_category;
    var categoryval = categoryobj.name.charAt(0)
    var producttypeobj = apidata.product_type;
    var producttypeval = producttypeobj.shortCode;
    var seriesvalue = apidata.startcode + 1;
    var vendorname = "NAC";
    var skuprefix = "S"+producttypeval+seriesvalue+"-";
     
    
    var puritylist = apidata.purity;
        puritylist.forEach(purity => {
            var sku = skuprefix + purity.shortCode 
            var skuobj = {
                product_type: producttypeval,
                service_name: vendorname,
                product_series: seriesvalue,
                purity: purity.shortCode,
                generated_sku: sku
            }
            product_skus.push(skuobj)
        });

        console.log("purtity"+ product_skus.length)
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
                metal_color:metalcolor.shortCode
                }
                product_skus.push(skuobj)


            });
        }); 



        var skus = product_skus;

        product_skus = [];
        var diamond_sku_clarity = apidata.diamond_sku_clarity;
        var diamondlist = apidata.diamond;
        skus.forEach(skuvalue => {
            var  skuval = skuvalue.generated_sku

            diamondlist.forEach(diamond => {
              var clarity =  diamond.clarity.name +'-'+diamond.colour.shortCode  
              
              var sku = skuval + diamond_sku_clarity[clarity]
                var skuobj = 
                {
                ...skuvalue,
                generated_sku: sku,
                diamond_color:diamond.colour.shortCode
                }
                product_skus.push(skuobj)
            });
        });
        

        skus = product_skus;
        var gemstonelist = apidata.gemstone;
        var gemstonesku = ""; 
        var gemstonecolorcode1 = "00"; 
        var gemstonecolorcode2 = "00"; 
        var gemstoneshortcode = "00"; 
        var gemstonecolorcode2 = "00"; 
        if(gemstonelist.length > 0)
        {
            var firstgemobj = gemstonelist[0];
            gemstoneshortcode =   firstgemobj.type.shortCode;
            gemstonesku = firstgemobj.type.colorCode;
            gemstonecolorcode1 = firstgemobj.type.colorCode
        }
        if(gemstonelist.length > 1)
        {
            var secondgemobj = gemstonelist[1];

            gemstonesku = gemstonesku+secondgemobj.type.colorCode;
            gemstonecolorcode2 = secondgemobj.type.colorCode;
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

       
        skus = product_skus;
        product_skus = [];
        var sizelist = apidata.size;
        console.log(sizelist.length)
        skus.forEach(skuvalue => {
            sizelist.forEach(sizevalue => {
                var sku = skuvalue.generated_sku+"_"+ sizevalue
               
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
    //        var productlist = [
    //         product_skus[0],
    //         product_skus[1]
    //     ]

          models.trans_sku_lists.bulkCreate(
            uploadskus
              , {individualHooks: true}).then(function(response){
                res.json(response);
              })
              //res.send(200, { submitted: true })
        // models.trans_sku_descriptions.create(
        //     {id:uuidv1(), sku_id: 'b73216a0-c95f-11e9-8ee8-a9d9fbea3b2a'}
        //   ).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
        //     console.log("created");
        //   })
    

}