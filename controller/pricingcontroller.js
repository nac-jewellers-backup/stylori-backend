
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const squelize= require('sequelize');
const uuidv1 = require('uuid/v1');
exports.priceupdate = (req, res) => {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {}
    var responseobj = {};
    var pricesplitup = []
    var products = []
    var processed_product_count = 0;
    models.product_lists.findAll({
      include: [{
        model: models.trans_sku_lists,
        where:{
          generated_sku: 'SR1313-14113400-10'
        }
       },
       {
        model: models.product_diamonds,

       },
       {
        model: models.product_gemstones,

       }
      
      ],
      where: {
        product_id: 'SR1313'
      }
    }).then(product=> {
     
      products = product;

      processproduct()
    });
    function processproduct(){
      if(products.length > processed_product_count)
      {
        product_obj = products[processed_product_count]
        diamond_price(product_obj.vendor_code, product_obj.product_diamonds)
      }else{
        res.send(200,{message: "success"})
      }
    }


    function calculatesellingmarkup(markupval, materialsellingprice)
    {
      var newsellingmarkup = materialsellingprice;
      if(markupval)
      {
      if(markupval.markup_type === 1)
      {
        newsellingmarkup = markupval.markup_value
      }
     }
     return newsellingmarkup;
    }

    function calculatediscountmarkup(discountval, materialsellingprice)
    {
      var newsellingmarkup = materialsellingprice;
      if(discountval)
      {
      if(discountval.discount_type === 1)
      {
        newsellingmarkup = discountval.discount_value
      }
     }
     return newsellingmarkup;
    }
    /******  Product Diamond  Price calculation */
    function diamond_price(vendorcode, diamonds)
    {
      var costprice_diamond = 0;
      var sellingprice_diamond = 0;
      var processcount = 0;
      var product_diamonds = diamonds;
   
      if(product_diamonds.length > 0)
      {
        diamond_process(product_diamonds[0]);

      }else
      {
        product_gemstone(product_obj.vendor_code, product_obj.product_gemstones)

      }

    
    
   
    function diamond_process(diamondobj)
     {
        var conditionobj = {
           vendor_code: vendorcode,
             diamond_colour: diamondobj.diamond_clarity,
             diamond_clarity: diamondobj.diamond_colour
        }
 

        
        models.diamond_price_settings.findOne({

            where: conditionobj
        }).then(async diamondcharge=> {

            var diamondcost = (diamondobj.stone_weight * diamondcharge.cost_price)
            var diamondsellingprice =  (diamondobj.stone_weight * diamondcharge.selling_price) 

            costprice_diamond = costprice_diamond + diamondcost
            sellingprice_diamond = sellingprice_diamond + diamondsellingprice

            processcount++;
           
              
              let diamondmarkup =  await materialmarkupval('Diamond',diamondsellingprice)
              diamondsellingprice = calculatesellingmarkup(diamondmarkup,diamondsellingprice)
             let diamonddiscount =  await materialdiscountval('Diamond',diamondsellingprice)  
             diamondsellingprice = await calculatediscountmarkup(diamonddiscount,diamondsellingprice)
            var  diamondmargin = ((diamondsellingprice - diamondcost)/diamondcost)*100
              var diamondprice = {
                material_name: 'diamond'+processcount,
                id: uuidv1(),
                margin_percentage: diamondmargin,
                cost_price:diamondcost,
                selling_price:diamondsellingprice,
                product_id: product_obj.product_id
                
              }  
              models.pricing_sku_materials.findOne({
                where: {product_id: product_obj.product_id, material_name: diamondprice.material_name}
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
              function isdiamondexist()
              {
                if(product_diamonds.length > processcount)
                {
                
               diamond_process(product_diamonds[processcount])
                }else{
                  responseobj['diamondprice'] = {
                    costprice_diamond,
                    sellingprice_diamond
                  }
                  product_gemstone(product_obj.vendor_code, product_obj.product_gemstones)

                }
              }
              
          });
        


   }

  }


    /******  Product gemstone  Price calculation */

  function product_gemstone(vendorcode, gemstones)
  {
    var gemstone_costprice = 0.0;
    var gemstone_sellingprice = 0.0;
    var gemstone_count = 0;
    var product_gemstones = gemstones;
    
      if(product_gemstones.length > 0)
      {
        gemstone_price(product_gemstones[0]);
      }else{
        processskus(product_obj.trans_sku_lists, product_obj)

      }


  
  function gemstone_price(gemstoneobj)
  { 
    var whereclause = {
      vendor_code: vendorcode,
      gemstone_type: gemstoneobj.gemstone_type,
    }
 
    if(gemstoneobj.stone_weight)
    {
      var stoneweight = gemstoneobj.stone_weight/ gemstoneobj.stone_count
      whereclause['weight_start'] = { [Op.lte]: stoneweight }
      whereclause['weight_end'] = { [Op.gte]: stoneweight }
    }
    
    models.gemstone_price_settings.findOne({
          where: whereclause
      }).then(async gemstonecharge=> {
        var  gemstonemargin = 0;
        var  gemstonecost = 0;
        var  gemstonesell = 0;
        if(gemstonecharge.selling_price_type == 3)
        {
           gemstonecost = gemstonecharge.cost_price;
           gemstonesell = gemstonecharge.selling_price;
          gemstone_costprice = gemstone_costprice +  ( gemstoneobj.stone_count * gemstonecharge.cost_price);
          gemstone_sellingprice = gemstone_sellingprice + ( gemstoneobj.stone_count * gemstonecharge.selling_price);

        }else{
           gemstonecost = gemstonecharge.cost_price;
           gemstonesell = gemstonecharge.selling_price;
          gemstone_costprice = gemstone_costprice + gemstonecharge.cost_price;
          gemstone_sellingprice = gemstone_sellingprice + gemstonecharge.selling_price;

        }
        let gemstonemarkup = await materialmarkupval('Gem Stone',gemstonesell)
        gemstonesell = calculatesellingmarkup(gemstonemarkup, gemstonesell)
        
        let gemstonediscount =  await materialdiscountval('Gem Stone',gemstonesell)  
        gemstonesell = calculatediscountmarkup(gemstonediscount, gemstonesell)

        gemstonemargin = ((gemstonesell - gemstonecost)/gemstonecost)*100

        gemstone_count++;
        var gemstoneobj = {};
    
        pricesplitup.push(gemstoneobj);

        var gemstoneprice ={
          material_name: 'gemstone'+gemstone_count,
          id: uuidv1(),
          margin_percentage: gemstonemargin,
          cost_price:gemstonecost,
          selling_price:gemstonesell,
          product_id: product_obj.product_id
          
        }  
       
        models.pricing_sku_materials.findOne({
          where: {product_id: product_obj.product_id, material_name: gemstoneprice.material_name}
        }).then(price_splitup_model=> {
          if (price_splitup_model) {
            var  gemstonemargin1 = (((gemstonesell + (price_splitup_model.markup)) - gemstonecost)/gemstonecost)*100
            gemstoneprice['margin_percentage'] = gemstonemargin1;
            price_splitup_model.update(gemstoneprice)
            .then(updatedmakingchargeprice => {
              isgemstoneexist()
            })
            .catch(reason => {
              isgemstoneexist()
            });
          }else{
            models.pricing_sku_materials.create(gemstoneprice).then((result) => {
              isgemstoneexist()
            })
            .catch((error) => {
              isgemstoneexist()
            });
          }
        })

        function isgemstoneexist()
        {
            if(product_gemstones.length > gemstone_count)
            {
              gemstone_price(product_gemstones[gemstone_count])
            }else{
              responseobj['gemstoneprice'] = {
                gemstone_costprice,
                gemstone_sellingprice
                  }
            
             
               processskus(product_obj.trans_sku_lists, product_obj)
            }
        }


      });
      
  }





}


  /********** Material Markup calculation */
 function materialmarkupval(material_name, sellingprice_val)
  {
      const priceMarkup =  models.pricing_markup.findOne({
          where: {
            material: material_name,
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

  function materialdiscountval(material_name, sellingprice_val)
  {
      const pricediscount =  models.pricing_discount_setup.findOne({
          where: {
            material: material_name,
            selling_price_min:{
              [Op.lte]: sellingprice_val
            },
            selling_price_max:{
              [Op.gte]: sellingprice_val 
            }
          }
        });
       

        return pricediscount;
  }

  function gettaxmaster(producttype)
  {
    const taxxcontent =  models.master_tax_settings.findOne({
      where: {
        product_type: producttype
      }
    });
   

    return taxxcontent;
    
  }





    function processskus(productskus, productobj)
    {
      var skucount = 0;
     
      console.log("goldpriceupdate");
     
     updategoldprice(productobj.vendor_code, productskus[0])
    function updategoldprice(vendorcode, skuobj )
    {
        models.gold_price_settings.findOne({

            where: {
              vendor_code: product_obj.vendor_code,
              purity: skuobj.purity
            }
        }).then(async gold_price=> {
           
            costprice = gold_price.cost_price * skuobj.sku_weight
            sellingprice = calculatepercentage(costprice,gold_price.selling_price_percentage)  

              responseobj['goldprice'] = {
                costprice,
                sellingprice
              }
            var goldpriceobj = { }
              goldpriceobj['goldprice'] = {
                costprice,
                sellingprice
              }

            let goldmarkup =  await materialmarkupval('Gold',sellingprice)  
            sellingprice = calculatesellingmarkup(goldmarkup, sellingprice)
            let golddiscount =  await materialdiscountval('Gold',sellingprice)  
            sellingprice =  calculatediscountmarkup(golddiscount,sellingprice)
          
          
            var goldmargin = ((sellingprice - costprice)/costprice)*100

            var goldprice ={
              material_name: 'goldprice',
              cost_price:costprice,
              selling_price:sellingprice,
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
                  console.log('iamhere')
                  makingcharge();
                })
                .catch(reason => {

                  makingcharge();
                });
              }
              else{
                models.pricing_sku_metals.create(goldprice).then((result) => {
                  makingcharge();
                })
                .catch((error) => {
                  console.log("errodmessage"+JSON.stringify(error.message))
                  makingcharge();
                });

              }
            })
              

    
        });
      }

      function makingcharge()
      {
        var mkcostprice = 0;
        var mksellingprice = 0;
          models.making_charge_settings.findOne({
              where: {
                vendor_code: product_obj.vendor_code,
                purity: productskus[skucount].purity,
                material: 'gold',
                weight_start:{
                  [Op.lte]: productskus[skucount].sku_weight
                },
                weight_end:{
                  [Op.gte]: productskus[skucount].sku_weight
                }
               
              }
          }).then(async makingcharge=> {
  
              console.log(">>>>>>>>"+makingcharge.rate_type)
                if(makingcharge.rate_type == 1)
                {
                  mkcostprice =    makingcharge.cost_price
  
                }else 
                {
                  mkcostprice =   (productskus[skucount].sku_weight * makingcharge.cost_price)
                }
              
  
              if(makingcharge.selling_price_type == 1)
              {
                if(makingcharge.rate_type == 1)
                {
                  mksellingprice =   makingcharge.selling_price
  
  
                }else{
                  mksellingprice =    (productskus[skucount].sku_weight * makingcharge.selling_price)
  
                }
  
              }else if(makingcharge.selling_price_type == 2)
              {
                mksellingprice = calculatepercentage(costprice,makingcharge.selling_price)
              }


              let mkchargemarkup =  await materialmarkupval('MakingCharge',mksellingprice)  
              mksellingprice = calculatesellingmarkup(mkchargemarkup,mksellingprice)
              
              

              let mkchargediscount =  await materialdiscountval('MakingCharge',mksellingprice)  
              mksellingprice = calculatediscountmarkup(mkchargediscount,mksellingprice)

              

              responseobj['makingcharge'] = {
                mkcostprice,
                mksellingprice
              } 



              var makingchargeobj = {};
              makingchargeobj['makingcharge'] = {
                "costprice":mkcostprice,
                "sellingprice":mksellingprice
              }
              pricesplitup.push(makingchargeobj);
              var  makingmargin = ((mksellingprice - mkcostprice)/mkcostprice)*100
  
              var makingprice ={
                material_name: 'makingcharge',
                cost_price:mkcostprice,
                selling_price:mksellingprice,
                margin_percentage: makingmargin,
                product_sku: productskus[skucount].generated_sku
              }  
              models.pricing_sku_metals.findOne({
                where: {product_sku: productskus[skucount].generated_sku, material_name: 'makingcharge'}
              }).then(price_splitup_model=> {
                if (price_splitup_model) {
                  price_splitup_model.update(makingprice)
                  .then(updatedmakingchargeprice => {
                    updateskuprice();
                  })
                  .catch(reason => {
                    updateskuprice();
                  });
                }else{
                  models.pricing_sku_metals.create(makingprice).then((result) => {
                    updateskuprice();
                  })
                  .catch((error) => {
                    console.log("makingchargeprice"+error.message)
                    updateskuprice();
                  });
                }
              })
          });
      }
      function updateskuprice()
      {
        models.pricing_sku_materials.findOne({
          attributes: [
            [squelize.literal('SUM(cost_price)'), 'cost_price'],
            [squelize.literal('SUM(selling_price)'), 'selling_price']
          ],
          where: {
          product_id: product_obj.product_id
          }
      }).then(accs => {
        models.pricing_sku_metals.findOne({
          attributes: [
            [squelize.literal('SUM(cost_price)'), 'cost_price'],
            [squelize.literal('SUM(selling_price)'), 'selling_price']
          ],
          where: {
          product_sku: productskus[skucount].generated_sku
          }
          }).then(async product_splitup => {
            let total_costprice = accs.cost_price + product_splitup.cost_price;
            let total_sellingprice = accs.selling_price + product_splitup.selling_price;
            let sku_margin = ((total_sellingprice - total_costprice)/total_costprice)*100
            let taxcomponent = await gettaxmaster('Rings');
            console.log("+++))()()()"+calculatepercentage(total_costprice,taxcomponent.tax_value));
            console.log("+++))()()()"+calculatepercentage(total_sellingprice,taxcomponent.tax_value));
            let transskuobj = {
              cost_price : total_costprice,
              selling_price : total_sellingprice,
              margin_on_sale_percentage : sku_margin

            }
            models.trans_sku_lists.findOne({
              where: {generated_sku: productskus[skucount].generated_sku}
            }).then(price_splitup_model=> {
              if (price_splitup_model) {
                price_splitup_model.update(transskuobj)
                .then(updatedsku => {
                  isskuexist()
                })
                .catch(reason => {
                  isskuexist()
                });
              }
            });        


          });
      });
      }
      function isskuexist()
      {


        skucount = skucount + 1;
          if(product_obj.trans_sku_lists.length > skucount)
          {
            updategoldprice(product_obj.vendor_code, product_obj.trans_sku_lists[skucount])

          }else{
            processed_product_count = processed_product_count  + 1;
            processproduct();
          }
      }
    }
    function calculatepercentage(priceval , percentageval)
    {
      return (priceval + priceval *(percentageval/100))
    }
   

    
  
 
}