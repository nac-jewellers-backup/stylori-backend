
const models=require('./../models');
const splitprice = require('./../controller/productMasters');

import 'dotenv/config';
const Op= require('sequelize').Op;
const squelize= require('sequelize');
const uuidv1 = require('uuid/v1');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
exports.splitdiamondpriceupdate = (req, res) => {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {}
    var responseobj = {};
    var pricesplitup = []
    var products = []
    var processed_product_count = 0;
    var processed_sku_count = 0;

    products = req.products
    processproduct(processed_product_count)
    res.send(200,{message:"Update Successfully"})

   async function processproduct(processed_product_count)
    {
        var product_skus = []
        if(products.length > processed_product_count)
        {
            let product_id = products[processed_product_count]
            let prod_trans =  await splitprice.producttransskus(product_id)
            if(prod_trans)
            {
                product_skus = prod_trans.trans_sku_lists;
                if(product_skus.length > 0)
                {
                    diamondpricesetup(product_skus[processed_sku_count],prod_trans)
                }else
                {

                }
            }

           async function diamondpricesetup(skuobj, product_obj)
            {
                var diamondsetups = []
                if(skuobj)
                {
                 let sku_diamonds =    await splitprice.skudiamond(product_obj.product_id, skuobj.diamond_type)
                var process_diamond_count = 0
                processdiamond(process_diamond_count)
                var costprice_diamond = 0;
                var sellingprice_diamond = 0;
                async function processdiamond(process_diamond_count)
                {
                    if(sku_diamonds.length > process_diamond_count)
                    {
                        let diamondobj =  sku_diamonds[process_diamond_count]
                         var conditionobj = {
                            vendor_code: product_obj.vendor_code,
                          diamond_colour: diamondobj.diamond_clarity,
                          diamond_clarity: diamondobj.diamond_colour
                     }
                      
                        let diamond_price_setup = await models.diamond_price_settings.findOne({
                            where: conditionobj
                        })

                        if(diamond_price_setup)
                        {
                        var diamondcost = (diamondobj.stone_weight * diamond_price_setup.cost_price)
                        var diamondsellingprice =  (diamondobj.stone_weight * diamond_price_setup.selling_price) 

                        costprice_diamond = costprice_diamond + diamondcost
                        sellingprice_diamond = sellingprice_diamond + diamondsellingprice
            
                        var  diamondmargin = ((diamondsellingprice - diamondcost)/diamondcost)*100

                        }
                        

                        var diamondprice = {
                            component: "diamond"+process_diamond_count+"_"+product_obj.product_id,
                            material_name: diamondobj.diamond_clarity+""+diamondobj.diamond_colour,
                            id: uuidv1(),
                            margin_percentage: diamondmargin,
                            cost_price:diamondcost,
                            selling_price:diamondsellingprice,
                            markup:diamondsellingprice,
                            discount_price:diamondsellingprice,
                            product_id: product_obj.product_id,
                            product_sku: skuobj.generated_sku
                          }
                       
                        let price_splitup_model =  await  models.pricing_sku_materials.findOne({
                            where: {product_sku: skuobj.generated_sku, component: diamondprice.component}
                          });
                          if(price_splitup_model)
                          {
                             price_splitup_model.update(diamondprice).then((result) => {
                                isdiamondexist()
                              }).catch(reason => {
                                isdiamondexist()
                              });

                          }else{
                             models.pricing_sku_materials.create(diamondprice).then(updatedmakingchargeprice => {
                                isdiamondexist()
                              })
                              .catch(reason => {
                                isdiamondexist()
                              });

                          }
                          function isdiamondexist()
                          {

                        process_diamond_count = process_diamond_count +1;
                        processdiamond(process_diamond_count)
                          }
                    }else{
                        
                        isskuexist()
                    }

                }


                
                }else{

                    isskuexist()
                }

            }
            function isskuexist()
            {
                processed_sku_count = processed_sku_count + 1;
                if(product_skus.length > processed_product_count)
                {
                    diamondpricesetup(product_skus[processed_sku_count])
                }else{
                    processed_product_count = processed_product_count+1
                    processproduct(processed_product_count)
                }
            }


        }else{

        }
        
    }



    
}



exports.splitgoldpriceupdate = (req, res) => {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {}
    var responseobj = {};
    var pricesplitup = []
    var products = []
    var processed_product_count = 0;
    var processed_sku_count = 0;
    res.send(200,{message:"Update Successfully"})

    products = req.products
    processproduct(processed_product_count)
   async function processproduct(processed_product_count)
    {
        var product_skus = []
        if(products.length > processed_product_count)
        {
            let product_id = products[processed_product_count]
            let prod_trans =  await splitprice.producttransskus(product_id)
            if(prod_trans)
            {
                product_skus = prod_trans.trans_sku_lists;
                if(product_skus.length > 0)
                {
                    goldpricesetup(product_skus[processed_sku_count],prod_trans)
                }else
                {
                    processed_product_count = processed_product_count+1
                    processproduct(processed_product_count)

                }
            }

           async function goldpricesetup(skuobj, product_obj)
            {
                if(skuobj)
                {
                    var purityval = skuobj.purity;
                let gold_price =  await models.gold_price_settings.findOne({
                        where: {
                          vendor_code: product_obj.vendor_code,
                          purity: parseInt(purityval.replace('K',''))
                        }
                    })

                    costprice = gold_price.cost_price * skuobj.sku_weight
                    if(gold_price.selling_price_type == 2)
                    {
                      sellingprice = calculatepercentage(costprice,gold_price.selling_price)  
        
                    }else{
                      sellingprice = gold_price.selling_price * skuobj.sku_weight
                    }

                    var goldmargin = ((sellingprice - costprice)/costprice)*100

                    var goldprice ={
                      material_name: 'goldprice',
                      cost_price:costprice,
                      selling_price:sellingprice,
                      markup:sellingprice,
                      discount_price:sellingprice,
                      margin_percentage: goldmargin,
                      product_sku: skuobj.generated_sku,
                      createdAt: new Date(),
                      modifiedAt: new Date()
                    }  
                    pricesplitup.push(goldpriceobj);

                    models.pricing_sku_metals.findOne({
                        where: {product_sku: skuobj.generated_sku, material_name: 'goldprice'}
                      }).then(price_splitup_model=> {
                        if (price_splitup_model) {
                          price_splitup_model.update(goldprice)
                          .then(updatedgoldprice => {
          
                            isskuexist()
                          })
                          .catch(reason => {
          
                            isskuexist()
                          });
                        }
                        else{
                          models.pricing_sku_metals.create(goldprice).then((result) => {
                            isskuexist()
                        
          
                          })
                          .catch((error) => {
          
                            isskuexist()
                          });
          
                        }
                      })
                }else{
                    isskuexist()
                }
            }
            function isskuexist()
            {
                processed_sku_count = processed_sku_count + 1;
                if(product_skus.length > processed_product_count)
                {
                    diamondpricesetup(product_skus[processed_sku_count])
                }else{
                    processed_product_count = processed_product_count+1
                    processproduct(processed_product_count)
                }
            }


        }else{
            res.send(200,{message:"Update Successfully"})

        }
        
    }



    
}


exports.splitmakingchargeupdate = (req, res) => {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {}
    var responseobj = {};
    var pricesplitup = []
    var products = []
    var processed_product_count = 0;
    var processed_sku_count = 0;
    res.send(200,{message:"Update Successfully"})

    products = req.products
    processproduct(processed_product_count)
   async function processproduct(processed_product_count)
    {
        var product_skus = []
        if(products.length > processed_product_count)
        {
            let product_id = products[processed_product_count]
            let prod_trans =  await splitprice.producttransskus(product_id)
            if(prod_trans)
            {
                product_skus = prod_trans.trans_sku_lists;
                if(product_skus.length > 0)
                {
                    makingchargesetup(product_skus[processed_sku_count],prod_trans)
                }else
                {
                    processed_product_count = processed_product_count+1
                    processproduct(processed_product_count)

                }
            }

           async function makingchargesetup(skuobj, product_obj)
            {
                if(skuobj)
                {
                    var mkcostprice = 0;
                     var mksellingprice = 0;
                    var purityval = skuobj.purity;
                let gold_price =  await  models.making_charge_settings.findAll({
                    where: {
                      vendor_code: vendorcode,
                      purity: parseInt(purityval.replace('K','')),
                      material: 'Gold',
                      weight_start:{
                        [Op.lte]: productskus[skucount].sku_weight
                      },
                      weight_end:{
                        [Op.gte]: productskus[skucount].sku_weight
                      }
                     
                    }
                })
                if(makingcharge)
            {
                makingcharge.forEach(makingcharge_obj => {
                    if(makingcharge_obj.price_type == 1)
                    {
                      if(makingcharge_obj.rate_type == 1)
                        {
                          mkcostprice =    makingcharge_obj.price
          
                        }else 
                        {
                          mkcostprice =   (productskus[skucount].sku_weight * makingcharge_obj.price)
                        }
                    }
    
                    if(makingcharge_obj.price_type == 2)
                    {
                      if(makingcharge_obj.rate_type == 1)
                      {
                        if(makingcharge_obj.selling_price_type == 1)
                          {
                            
                            mksellingprice =   makingcharge_obj.price
    
                          }else if(makingcharge_obj.selling_price_type == 2)
                          {
                            mksellingprice = calculatepercentage(costprice,makingcharge_obj.price)
                          }
    
                      }else if(makingcharge_obj.rate_type == 2)
                      {
    
                        if(makingcharge_obj.rate_type == 1)
                        {
                          mksellingprice =   makingcharge_obj.price
                        }else{
                          mksellingprice =    (productskus[skucount].sku_weight * makingcharge_obj.price)
          
                        }
                      }
                    }
    
                  })
                  var  makingmargin = ((mksellingprice - mkcostprice)/mkcostprice)*100
  
                  var makingprice ={
                    material_name: 'makingcharge',
                    cost_price:mkcostprice,
                    selling_price:mksellingprice,
                    markup:mksellingprice,
                    discount_price: mksellingprice,
                    margin_percentage: makingmargin,
                    product_sku: skuobj.generated_sku
                  }  
                  models.pricing_sku_metals.findOne({
                    where: {product_sku: skuobj.generated_sku, material_name: 'makingcharge'}
                  }).then(price_splitup_model=> {
                    if (price_splitup_model) {
                      price_splitup_model.update(makingprice)
                      .then(async updatedmakingchargeprice => {
                       
    
                        isskuexist()
                      })
                      .catch(reason => {
                             //  res.send(200,{"message":reason.message,price_splitup_model});
    
                       isskuexist()
                      });
                    }else{
                      models.pricing_sku_metals.create(makingprice).then(async (result) => {
                       
                       
                        // gemstonesell = calculatesellingmarkup(gemstonemarkup, gemstonesell)
                       isskuexist()
                        
    
                      })
                      .catch((error) => {
                        
                        
                       isskuexist()
                      });
                    }
                  })
            }else{
                isskuexist()
            }
                    
            
            function isskuexist()
            {
                processed_sku_count = processed_sku_count + 1;
                if(product_skus.length > processed_product_count)
                {
                    diamondpricesetup(product_skus[processed_sku_count])
                }else{
                    processed_product_count = processed_product_count+1
                    processproduct(processed_product_count)
                }
            }


        }else{
                processed_product_count = processed_product_count+1
                processproduct(processed_product_count)
            

        }
        
    }




    
}else{

}
    }
}


