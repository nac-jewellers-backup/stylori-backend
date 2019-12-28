const models=require('./../models');
import 'dotenv/config';
import {sendMail} from "./notify/user_notify"
const Op= require('sequelize').Op;
var Sequelize = require('sequelize');
const uuidv1 = require('uuid/v1');
var fs = require("fs");


exports.priceupdate = (req, res) => {
    /*** contains list of products to be upate */
  function writelog(message)
  {
    message = message + '\n'
    // fs.appendFile("./price_update.txt", message, (err) => {
    //   if (err) console.log(err);
    // //  console.log("Successfully Written to File.");
     
    // });
    
  }

    var products = []
    var product_ids = []
    var product_obj = {}
    var pricing_comp = []
    var processed_product_count = 0;
    const {req_product_id, vendorcode,category,product_type,metalpurity,pricingcomponent,purity,sizes,diamondtypes} = req.body
    /******* whereclause to filter  product */
    var product_whereclause = {
        isactive : true,
        // product_id : {
        //   [Op.iLike]:'%SR0505%'
            
        // },
        
        product_id: 
          {
          [Op.in]:['SR0323']
          }
      }
    /******* whereclause to filter  skus */
    var skuwhereclause = {}
    /******* track execution time */
    var  startDate = new Date()


    /********* construct where clause based on user input */
    if(req_product_id)
    {
      var product_id_array = req_product_id.split(',');
      product_whereclause = {
        product_id : {
          [Op.in]: product_id_array
        }
      }
    }

    let vendor_array = []
    if(vendorcode)
    {
      vendorcode.forEach(element => {
        vendor_array.push(element.shortCode)
      })
     
      product_whereclause['vendor_code'] = {
        [Op.in] : vendor_array
      }
    }

    if(pricingcomponent)
    {
      pricingcomponent.forEach(element => {
          pricing_comp.push(element)
      })
    }

    let purity_array = [];
    
    if(purity)
    {
      metalpurity.forEach(element => {
        purity_array.push(element.alias)
      })
      skuwhereclause['purity'] = {
        [Op.in] : purity_array
      }
    }

    let sku_size_array = []
    if(sizes)
    {
      sizes.forEach(elemet => {
        sku_size_array.push(elemet.sku_size)
      })
      skuwhereclause['sku_size'] = {
        [Op.in] : sku_size_array
      }
    }

    let diamond_type_array = []
    if(diamondtypes)
    {
      diamondtypes.forEach(element => {
        diamond_type_array.push(element.label)
      })
     
      skuwhereclause['diamond_type'] = {
        [Op.in] : diamond_type_array
      }
    }
    // skuwhereclause['generated_sku'] = {
    //   [Op.eq] : 'SR0771-18110000-16'
    // }
    let product_category_array = [];

    if(category)
    {
       category.forEach(element => {
        product_category_array.push(element.name)
      })
      product_whereclause['product_category'] = {
        [Op.in] : product_category_array
      }
    }


    let product_type_array = []
    if(product_type)
    {
       product_type.forEach(element => {
        product_type_array.push(element.name)
      })
      product_whereclause['product_type'] = {
        [Op.in] : product_type_array
      }
    }


    /*******************End of whereclause */

    /************query to find all product list to run price update */
    models.product_lists.findAll({
        where: product_whereclause,
       
            }).then(product=> {
       console.log("total product ------- "+ product.length)
   //    writelog("total product ------- "+ product.length) 
       products = product;

         processproduct()
      });

      var start = 0;
      /******** product prize running starting point */
      async function processproduct(){
        if(products.length > processed_product_count)
        {
          console.log("sku count ------- ") 

            start = new Date()
    
        let currentproduct = products[processed_product_count]
        product_ids.push(currentproduct.product_id)
        /** get products sku list and material list  */
        product_obj =   await  models.product_lists.findOne({
          include: [{
            model: models.trans_sku_lists,
            attributes:['generated_sku','sku_weight','product_id','purity','diamond_type','sku_size'],
            where:skuwhereclause
           },
           {
            model: models.product_diamonds,
            attributes:['diamond_type','diamond_colour','diamond_clarity','stone_count','stone_weight'],

           },
           {
            model: models.product_gemstones,
            attributes:['gemstone_type','stone_count','stone_weight'],

           }
         
          ],
          where: {
            product_id: currentproduct.product_id
          }
        })
        /************ End */

        /***** check product has more than one sku else process next product  */
        if(product_obj)
       {
        if(product_obj.trans_sku_lists.length > 0)
        {
          writelog("product_id ------- "+ product_obj.product_id) 
          writelog("sku count ------- "+ product_obj.trans_sku_lists.length) 
          console.log("sku count ------- "+ product_obj.trans_sku_lists.length) 

          processskus()

        }else{
          processed_product_count = processed_product_count  + 1;
          processproduct();
        }
       }else
       {
        processed_product_count = processed_product_count  + 1;
        processproduct();
       }
        /**** End */
      }else {
        writelog("price update complete ") 

      }
    }
   /********** end of process procduct function */





   /**** sku process start */
    async function processskus()
    {
        var skucount = 0;
        /**** function to update component pricing */
        updateskuprice()
       // updatediamondprice(product_obj.trans_sku_lists[0])

       /*********** Diamond Price update */
        async  function updatediamondprice(productsku)
        {

            var costprice_diamond = 0;
            var sellingprice_diamond = 0;
            var processcount = 0;
            /*****  get diamond list  */
            let product_diamonds = await productdiamonds(productsku.product_id,productsku.diamond_type)
            if(product_diamonds && product_diamonds.length > 0)
            {
              diamond_process(product_diamonds[0]);
            }else
            {
                console.log("diamond price complete")
            /*********** update next component */
            // updategemstone_price(product_obj.vendor_code, productsku)
    
            }

            /*** Process each diamond for prodcut */
            function diamond_process(diamondobj)
            {
                var conditionobj = {
                    vendor_code: product_obj.vendor_code,
                      diamond_colour: diamondobj.diamond_clarity,
                      diamond_clarity: diamondobj.diamond_colour
                 }

                 models.diamond_price_settings.findOne({
  
                    where: conditionobj
                }).then(async diamondcharge=> {
                    if(diamondcharge)
                    {
                        var diamondcost = (diamondobj.stone_weight * diamondcharge.cost_price)
                        var diamondsellingprice =  (diamondobj.stone_weight * diamondcharge.selling_price)
                        costprice_diamond = costprice_diamond + diamondcost
                        sellingprice_diamond = sellingprice_diamond + diamondsellingprice
                        processcount++;

                        var  diamondmargin = ((diamondsellingprice - diamondcost)/diamondcost)*100
                        var diamondprice = {
                            component: "diamond"+processcount+"_"+product_obj.product_id,
                            material_name: diamondobj.diamond_clarity+""+diamondobj.diamond_colour,
                            id: uuidv1(),
                            margin_percentage: diamondmargin,
                            cost_price:diamondcost,
                            selling_price:diamondsellingprice,
                            markup:diamondsellingprice,
                            discount_price:diamondsellingprice,
                            product_id: product_obj.product_id,
                            product_sku: productsku.generated_sku
                            
                          } 
                          models.pricing_sku_materials.findOne({
                            where: {product_sku: productsku.generated_sku, component: diamondprice.component}
                          }).then(price_splitup_model=> {
                            if (price_splitup_model) {
                              price_splitup_model.update(diamondprice)
                              .then(updatedmakingchargeprice => {
                                isdiamondexist()
                              })
                              .catch(reason => {
                                isdiamondexist()
                              });
                            }else{
                              models.pricing_sku_materials.create(diamondprice).then((result) => {
                                isdiamondexist()
                              })
                              .catch((error) => {
                                isdiamondexist()
                              });
                            }
                          })

                    }else{
                        processcount++;
        
                        isdiamondexist()
                      }
                    
                });

                function isdiamondexist()
                {
                  
                  if(product_diamonds.length > processcount)
                  {
                  diamond_process(product_diamonds[processcount])
                  }else{
                    console.log("diamond price complete with "+processcount)
                    /*********** update nextcomponent */
  
                  }
                }
            }

        }
        /*********** End of diamond price update */

        /*********** Gemstone Price update */
        /*********** End of Gemstone price update */


        /*********** update sku price */
        async function updateskuprice()
        {
         var productskus = product_obj.trans_sku_lists;
        var  sku_component_count = 0
          var coponentarray = []
          writelog("start sku  ") 
          writelog(productskus[skucount].generated_sku)

          let metal_price_obj = await  models.pricing_sku_metals.findAll({
            attributes: [
              'material_name',
              [Sequelize.literal('SUM(cost_price)'), 'cost_price'],
              [Sequelize.literal('SUM(selling_price)'), 'selling_price']
            ],
            group: ['material_name'],
            where: {
            product_sku: productskus[skucount].generated_sku,
              
            }})

            let material_price_obj = await  models.pricing_sku_materials.findAll({
            attributes: [
            'component',
            [Sequelize.literal('SUM(cost_price)'), 'cost_price'],
            [Sequelize.literal('SUM(selling_price)'), 'selling_price']
            ],
            group:'component',
            where: {
            product_sku: productskus[skucount].generated_sku,

            }})   


            writelog("gemstone_percentage value"+JSON.stringify(material_price_obj))

            var goldsellingprice = 0;   
            var makingsellingprice = 0;
            var diamondsellingprice = 0;  
            var gemstonesellingprice = 0; 
            var diamond_component_count = 0; 
            var gemstone_component_count = 0; 
            var total_costprice = 0;
            var  total_sellingprice = 0;
            metal_price_obj.forEach(metal_price => {
            let metal_name = metal_price.material_name;
            total_costprice = total_costprice + metal_price.cost_price
            total_sellingprice = total_sellingprice + metal_price.selling_price

            if(metal_name.includes('gold'))
            {
            goldsellingprice = metal_price.selling_price
            }
            if(metal_name.includes('makingcharge'))
            {
            if(coponentarray.indexOf("makingcharge") == -1 )
            {
            coponentarray.push("makingcharge")
            }
            makingsellingprice = metal_price.selling_price

            }
            })
            material_price_obj.forEach(metal_price => {
            total_costprice = total_costprice + metal_price.cost_price
            total_sellingprice = total_sellingprice + metal_price.selling_price
            let metal_name = metal_price.component;
            if(metal_name.includes('diamond'))
            {
            diamond_component_count++;
            if(coponentarray.indexOf("diamond") == -1 )
            {
            coponentarray.push("diamond")
            }
            diamondsellingprice = metal_price.selling_price
            }
            if(metal_name.includes('gemstone'))
            {
            if(coponentarray.indexOf("gemstone") == -1 )
            {
            coponentarray.push("gemstone")
            }
            gemstonesellingprice = metal_price.selling_price
            gemstone_component_count++;
            }
            })
            sku_component_count = coponentarray.length
            let sku_margin = ((total_sellingprice - total_costprice)/total_costprice)*100
            let markupobj =  await materialmarkupval(total_sellingprice)
            var goldmarkupvalue = goldsellingprice;
         
            writelog("sku_component_count value"+sku_component_count)

            var makingchargemarkupvalue = makingsellingprice;
            var makingchargediscountvalue = ((makingchargemarkupvalue * 100) /(100 - 25));
            var diamondmarkupvalue = diamondsellingprice;
            var gemstonemarkupvalue = gemstonesellingprice;
  
            var gemstonediscountvalue = ((gemstonesellingprice * 100) /(100 - 25));
            var diamonddiscountvalue = ((diamondsellingprice * 100) /(100 - 25));
  
            markupobj.forEach(async markup => {
                  if(markup.material == 'Gold')
                    {
                      goldmarkupvalue = (goldsellingprice + (goldsellingprice * (markup.markup_value/100)))
                      var query = "UPDATE pricing_sku_metals SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)), discount_price = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name = 'goldprice'" ;
                      await models.sequelize.query(query).then(([results, metadata]) => {
                       
                      })
                    }
                  if(markup.material == 'Making Charge')
                    {
  
                      makingchargemarkupvalue = (makingsellingprice + (makingsellingprice * (markup.markup_value/100)))
                      makingchargediscountvalue = ((makingchargemarkupvalue * 100) /(100 - 25));
  
                      var query = "UPDATE pricing_sku_metals SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name = 'makingcharge'" ;
                      await models.sequelize.query(query).then(([results, metadata]) => {
                       
                      })
                    } 
                    if(markup.material == 'Gem Stone')
                    {
                      gemstonemarkupvalue = (gemstonesellingprice + (gemstonesellingprice * (markup.markup_value/100)))
                      gemstonediscountvalue = ((gemstonemarkupvalue * 100) /(100 - 25));
                      var query = "UPDATE pricing_sku_materials SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and component LIKE 'gemstone%'" ;
                      await models.sequelize.query(query).then(([results, metadata]) => {
                        // Results will be an empty array and metadata will contain the number of affected rows.
                      })
                    } 
                    
                    if(markup.material == 'Diamond')
                    {
                      diamondmarkupvalue = (diamondsellingprice + (diamondsellingprice * (markup.markup_value/100)))
                      diamonddiscountvalue = ((diamondmarkupvalue * 100) /(100 - 25));
                      var query = "UPDATE pricing_sku_materials SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name ='"+productskus[skucount].diamond_type+"'" ;
                      await models.sequelize.query(query).then(([results, metadata]) => {
                        // Results will be an empty array and metadata will contain the number of affected rows.
                      })
                    }
  
  
            });
  
            var golddiscountvalue = ((goldmarkupvalue * 100) /(100 - 25));

            writelog("gold discount value"+golddiscountvalue)
            
            var golddiscount_different = golddiscountvalue - goldmarkupvalue;
            writelog("gold golddiscount_different value"+golddiscount_different)

          var total_sku_discountvalue = golddiscountvalue + makingchargediscountvalue + diamonddiscountvalue + gemstonediscountvalue;
          writelog("total_sku_discountvalue value"+total_sku_discountvalue)

          var golddiscount_percentage = golddiscountvalue/total_sku_discountvalue;
          writelog("golddiscount_percentage value"+golddiscount_percentage)

          var makingcharge_percentage = makingchargediscountvalue/total_sku_discountvalue;
          writelog("makingcharge_percentage value"+makingcharge_percentage)

  
          var diamond_percentage = diamonddiscountvalue/total_sku_discountvalue;
          writelog("diamond_percentage value"+diamond_percentage)

          var gemstone_percentage = gemstonediscountvalue/total_sku_discountvalue;
          writelog("gemstone_percentage value"+gemstone_percentage)
        
             
          writelog("gold discount value"+golddiscount_percentage)

          var discount_price_distribute_percentage = golddiscount_percentage/sku_component_count;
          writelog("gemstone_percentage value"+discount_price_distribute_percentage)

          if(makingchargediscountvalue > 0)
           {
            writelog("makingchargediscountvalue before apply gold"+makingchargediscountvalue)

            makingchargediscountvalue = makingchargediscountvalue + (golddiscount_different * (discount_price_distribute_percentage + makingcharge_percentage));

            writelog("makingchargediscountvalue value"+makingchargediscountvalue)

          }
           if(gemstonediscountvalue > 0)
           {
            writelog("gemstonediscountvalue before apply gold"+gemstonediscountvalue)

            gemstonediscountvalue = gemstonediscountvalue + (golddiscount_different * (discount_price_distribute_percentage + gemstone_percentage));
            writelog("gemstonediscountvalue after apply gold"+gemstonediscountvalue)

           }
           golddiscountvalue = goldmarkupvalue;
           if(diamonddiscountvalue > 0)
           {
            writelog("diamonddiscountvalue before apply gold"+diamonddiscountvalue)

           diamonddiscountvalue = diamonddiscountvalue + (golddiscount_different * (discount_price_distribute_percentage + diamond_percentage));
           writelog("diamonddiscountvalue after apply gold"+diamonddiscountvalue)

          }
           
           total_sku_discountvalue = makingchargediscountvalue + golddiscountvalue + gemstonediscountvalue + diamonddiscountvalue;
  
          
          var mkquery = "UPDATE pricing_sku_metals SET discount_price = "+makingchargediscountvalue+" where product_sku ='"+productskus[skucount].generated_sku+"' and material_name = 'makingcharge'" ;
            await models.sequelize.query(mkquery).then(([results, metadata]) => {
               // Results will be an empty array and metadata will contain the number of affected rows.
             })
             if(diamond_component_count > 0)
                   {
             var materialquery = "UPDATE pricing_sku_materials SET discount_price = ((markup * 100) /(100 - 25) + ("+golddiscount_different+" * (("+discount_price_distribute_percentage+" + "+diamond_percentage+" )/"+diamond_component_count+"))) where product_sku ='"+productskus[skucount].generated_sku+"' and component ilike '%diamond%'" ;
                 await  models.sequelize.query(materialquery).then(([results, metadata]) => {
                     // Results will be an empty array and metadata will contain the number of affected rows.
                   })
                  }
                   if(gemstone_component_count > 0)
                   {
            var materialquery = "UPDATE pricing_sku_materials SET discount_price = ((markup * 100) /(100 - 25) + ("+golddiscount_different+" * (("+discount_price_distribute_percentage+" + "+gemstone_percentage+" )/"+gemstone_component_count+"))) where product_sku ='"+productskus[skucount].generated_sku+"' and component ilike '%gemstone%' " ;
                 await  models.sequelize.query(materialquery).then(([results, metadata]) => {
                     // Results will be an empty array and metadata will contain the number of affected rows.
                   })
                  }
                  
  
        
               var totaldiscountpricevalue = 0;
                var metaldiscountvalue = 0;
  
                let materialsum = await getmaterialmarkupsum(productskus[skucount].generated_sku)      
                let matalsum = await getmetalmarkupsum(productskus[skucount].generated_sku)      
                
                totaldiscountpricevalue = (materialsum.discount_price + matalsum.discount_price) ;
              
                // res.send(200,{materialsum, matalsum})
                const costpricetax = (total_costprice * 3 /100);
                const sellingpricetax = (total_sellingprice * 3 /100);
                
                let skumarkup = materialsum.markup + matalsum.markup;
                let skudiscount = materialsum.discount_price + matalsum.discount_price;
                const markuppricetax = (skumarkup * 3 /100);
                const discountpricetax  = (skudiscount * 3 /100);
                let transskuobj = {
                  cost_price : total_costprice + costpricetax,
                  cost_price_tax : costpricetax,
                  selling_price : total_sellingprice + sellingpricetax ,
                  selling_price_tax : sellingpricetax,
                  discount_price: skudiscount  + discountpricetax,
                  discount_price_tax : discountpricetax,
                  markup_price: skumarkup  + markuppricetax,
                  markup_price_tax :  markuppricetax,
                  margin_on_sale_percentage : sku_margin
                } 
                
               // res.send(200,{"material":materialsum,"metal":matalsum});
                models.trans_sku_lists.update(transskuobj,{
                where: {generated_sku: productskus[skucount].generated_sku}
                }).then(price_splitup_model=> {
                  isskuexist()
                
              }).catch(reason => {
                console.log(reason)
              });    
        }
        async function isskuexist()
      {
        skucount = skucount + 1;
        console.log("processsku"+skucount)

        writelog("processsku"+skucount)
        if(product_obj.trans_sku_lists.length > skucount)
        {

          updateskuprice()
        
        }else{

          console.log("i am here1")
          var endDate   = new Date();
          var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          startDate = new Date()
          console.log(seconds)
          
          processed_product_count = processed_product_count  + 1;
          await sleep(1000)
          if((processed_product_count > 0 && processed_product_count%25 == 0))
          {
            var emilreceipiants = [{to : "manokarantk@gmail.com"},{to : "dineshtawker@gmail.com"}]
       
            sendMail(emilreceipiants,JSON.stringify(product_ids))
          }
          console.log(JSON.stringify(product_ids))
          
          processproduct()
            ;
          
        }
      }
        /*********** end price update */



    }
   /**** end of sku process */
   async  function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

/********** Material Markup calculation */
function materialmarkupval( sellingprice_val)
{
    const priceMarkup =  models.pricing_markup.findAll({
        where: {
          selling_price_min:{
            [Op.lte]: sellingprice_val
          },
          selling_price_max:{
            [Op.gte]: sellingprice_val 
          }
        }
      });
      return priceMarkup;
}
function getmetalmarkupsum(skuvalue)
{
  return models.pricing_sku_metals.findOne({
    attributes: [
      [Sequelize.literal('SUM(markup)'), 'markup'],
      [Sequelize.literal('SUM(discount_price)'), 'discount_price']
    ],
    where: {
    product_sku: skuvalue
    }
    })
}
function getmaterialmarkupsum(skuvalue)
{
  return models.pricing_sku_materials.findOne({
    attributes: [
      [Sequelize.literal('SUM(markup)'), 'markup'],
      [Sequelize.literal('SUM(discount_price)'), 'discount_price']
    ],
    where: {
    product_sku: skuvalue
   
    }
})
}
/*********** Sku dimaond details */
   function productdiamonds(product_id,diamond_type)
  {
  return  models.product_diamonds.findAll({

      where: {
        diamond_type: diamond_type,
        product_sku: product_id
      }
      })
  }
}