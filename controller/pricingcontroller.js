
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
    res.send(200,{message:"success"})
    console.log(req.body)
    const {req_product_id} = req.body
    let whereclause1 = {
      isactive : true
    }
    if(req_product_id)
    {
      whereclause1 = {
        product_id : req_product_id,

      }
    }
    console.log(JSON.stringify(whereclause1))
    models.product_lists.findAll({
      /*include: [{
        model: models.trans_sku_lists,
        where:{
            generated_sku: 'SP0036-14230000'
        }
       },
       
       {
        model: models.product_diamonds,

       },
       {
        model: models.product_gemstones,

       },
       {
        model: models.product_occassions,

       },{
        model: models.product_styles,

       },
       {
        model: models.product_themes,

       }
      ],*/
      where: whereclause1
    }).then(product=> {
     
      products = product;
      console.log(">>>>>>>"+products.length)
 //    pricingresult()
//    res.send(200, products);
         processproduct()
    });
    async function processproduct(){
      if(products.length > processed_product_count)
      {
        let currentproduct = products[processed_product_count]
        product_obj =   await  models.product_lists.findOne({
          include: [{
            model: models.trans_sku_lists,
            where:{
               //  generated_sku: 'SR0271-18110000-15'
               cost_price: {
                // "$eq" changes to "[Op.eq]"
                  [Op.eq]: null
              }

            }
           },
           
           {
            model: models.product_diamonds,
    
           },
           {
            model: models.product_gemstones,
           }
          //  },
          //  {
          //   model: models.product_occassions,
    
          //  },{
          //   model: models.product_styles,
    
          //  },
          //  {
          //   model: models.product_themes,
    
          //  }
          ],
          where: {
            product_id: currentproduct.product_id
          }
        })
       // product_obj = products[processed_product_count]
       if(product_obj)
       {
        if(product_obj.trans_sku_lists.length > 0)
        {
          processskus(product_obj.trans_sku_lists, product_obj)

        }else{
          processed_product_count = processed_product_count  + 1;
          processproduct();
        }
       }else
       {
        processed_product_count = processed_product_count  + 1;
        processproduct();
       }

        //diamond_price(product_obj.vendor_code, product_obj.product_diamonds)
      }else{
       // res.send(200,{message: "succes1s"})
       processed_product_count = processed_product_count  + 1;
       processproduct();
      }
    }

   async function pricingresult()
    {
  let product_detail = await   models.trans_sku_lists.findAll({
         where :{
          generated_sku : req.body.sku

        }
      })
      let product_metals = await   models.pricing_sku_metals.findAll({
        where :{
          product_sku : req.body.sku

       }
     })
     let product_material = await   models.pricing_sku_materials.findAll({
      where :{
       product_sku : req.body.sku

     }
   })
   res.send(200,{product_detail, product_material,product_metals} )
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

    function calculatediscountmarkup(productobj, skuid)
    {
      var product_type = [];
      var product_occassions = [];
      var product_styles = [];
      var product_themes = [];
      if(product_obj.product_type)
      {
        product_type.push(product_obj.product_type);
      }
      if(product_obj.product_type)
      {
        product_type.push(product_obj.product_type);
      }
      // product_obj.product_occassions.forEach(function(element) {
      //   product_occassions.push(element.occassion_name);
      // });
      // product_obj.product_styles.forEach(function(element) {
      //   product_styles.push(element.style_name);
      // });
      // product_obj.product_themes.forEach(function(element) {
      //   product_themes.push(element.theme_name);
      // });

      // var newsellingmarkup = materialsellingprice;
      // if(discountval)
      // {
      // if(discountval.discount_type === 1)
      // {
      //   newsellingmarkup = discountval.discount_value
      // }
   return    models.pricing_discount_setup.findAll({
    include:[
      {
       model : models.discount_styles_mapping
      },
      {
        model : models.discount_occassions_mapping
       },
       {
        model : models.discount_themes_mapping
       },
       {
        model : models.discount_product_type_mapping
       }

    ],
    where:{
      
      '$discount_occassions_mappings.occassions$':
      {
      [Op.in]:product_occassions
      },
      '$discount_styles_mappings.styles$':
      {
      [Op.in]:product_styles
      },
      '$discount_themes_mappings.theme$':
      {
      [Op.in]:product_themes
      }
    }
  })


     
    }
    /******  Product Diamond  Price calculation */
    function diamond_price(vendorcode, diamonds)
    {
      var costprice_diamond = 0;
      var sellingprice_diamond = 0;
      var processcount = 0;
      var product_diamonds = diamonds;
   
      /*if(product_diamonds.length > 0)
      {
        diamond_process(product_diamonds[0]);

      }else
      {
        product_gemstone(product_obj.vendor_code, product_obj.product_gemstones)

      }*/


    
    
   
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
           
              
            //  let diamondmarkup =  await materialmarkupval('Diamond',diamondsellingprice)
            //  diamondsellingprice = calculatesellingmarkup(diamondmarkup,diamondsellingprice)
            //  let diamonddiscount =  await materialdiscountval('Diamond',diamondsellingprice)  
            //  diamondsellingprice = await calculatediscountmarkup(diamonddiscount,diamondsellingprice)
           
             var  diamondmargin = ((diamondsellingprice - diamondcost)/diamondcost)*100
              var diamondprice = {
                component: "diamond"+processcount+"_"+product_obj.product_id,
                material_name: diamondobj.diamond_clarity+" "+diamondobj.diamond_colour,
                id: uuidv1(),
                margin_percentage: diamondmargin,
                cost_price:diamondcost,
                selling_price:diamondsellingprice,
                product_id: product_obj.product_id
                
              }  
              models.pricing_sku_materials.findOne({
                where: {product_id: product_obj.product_id, component: diamondprice.component}
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
    
    models.gemstone_price_settings.findAll({
          where: whereclause
      }).then(async gemstonecharge=> {
        var  gemstonemargin = 0;
        var  gemstonecost = 0;
        var  gemstonesell = 0;
        var cost_price_type = 0;
        var sell_price_type = 0;
        var sell_percent_flat = 0;

        console.log("gemstonepricesettings")
        console.log(JSON.stringify(gemstonecharge));
        gemstonecharge.forEach(pricingobj => {
          if(pricingobj.price_type == 1)
          {
            gemstonecost = pricingobj.price
            cost_price_type = pricingobj.rate_type;
            
          }else if(pricingobj.price_type == 2)
          {
            gemstonesell = pricingobj.price
            sell_price_type = pricingobj.rate_type;
            sell_percent_flat = pricingobj.selling_price_type
          }

        })

            if(cost_price_type == 2)
            {
              if(gemstoneobj.stone_weight){
                gemstonecost = gemstonecost * gemstoneobj.stone_weight
              }
            }
            if(sell_price_type == 1)
            {
              if(sell_percent_flat == 2)
              {
                gemstonesell = calculatepercentage(gemstonecost,gemstonesell)  
              }
              
            }else if(sell_price_type == 2)
            {
              if(sell_percent_flat == 2)
              {
                gemstonesell = calculatepercentage(gemstonecost,gemstonesell)  
              }else{
              if(gemstoneobj.stone_weight){
                gemstonesell = pricingobj.price * gemstoneobj.stone_weight
              }
            }
            }

       /* if(gemstonecharge.selling_price_type == 3)
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
        */
        // let gemstonediscount =  await materialdiscountval('Gem Stone',gemstonesell)  
        // gemstonesell = calculatediscountmarkup(gemstonediscount, gemstonesell)

        gemstonemargin = ((gemstonesell - gemstonecost)/gemstonecost)*100

        gemstone_count++;
        var gemstoneobj = {};
    
        pricesplitup.push(gemstoneobj);

        var gemstoneprice ={
          component: 'gemstone'+gemstone_count,
          material_name: gemstoneobj.gemstone_type,
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

  function productdiamonds(product_id,diamond_type)
  {
  return  models.product_diamonds.findAll({

      where: {
        diamond_type: diamond_type,
        product_sku: product_id
      }
      })
  }


  function productgems(product_id)
  {
  return  models.product_gemstones.findAll({

      where: {
        product_sku: product_id
      }
      })
  }



  function diamondpricesettings(diamond_color,diamond_clarity,vendor_code)
  {
  return  models.diamond_price_settings.findAll({

      where: {
        diamond_colour: diamond_color,
        diamond_clarity: diamond_clarity,
        vendor_code: vendor_code
      }
      })
  }

  


  async   function processskus(productskus, productobj)
    {
      var skucount = 0;

    //updategoldprice(productobj.vendor_code, productskus[0])
   updatediamondprice(productobj.vendor_code, productskus[0])
    async  function updatediamondprice(vendor_code,productsku)
     {
      var costprice_diamond = 0;
      var sellingprice_diamond = 0;
      var processcount = 0;
       var diamondprice1 = []
        let product_diamonds = await productdiamonds(productsku.product_id,productsku.diamond_type)
          console.log("diamondcountval"+product_diamonds.length);

          if(product_diamonds.length > 0)
        {
          diamond_process(product_diamonds[0],vendor_code);
        }else
        {
         // updateskuprice()
         updategemstone_price(product_obj.vendor_code, productskus[0])

       }

       function diamond_process(diamondobj,vendorcode)
       {
          var conditionobj = {
             vendor_code: vendorcode,
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
                isdiamondexist()
              }
                function isdiamondexist()
                {
                  if(product_diamonds.length > processcount)
                  {
                  
                  diamond_process(product_diamonds[processcount],vendorcode)
                  }else{
                  //  updateskuprice() 
                    updategemstone_price(product_obj.vendor_code, productskus[0])

  
                  }
                }
                
            });
          
  
  
        }
       console.log("i am here");
      };
    

    async  function updategemstone_price(vendor_code,productsku)
      {
        var  gemstonemargin = 0;
        var  gemstonecost = 0;
        var  gemstonesell = 0;
        var  gemstone_count = 0;
        var cost_price_type = 0;
        var sell_price_type = 0;
        var sell_percent_flat = 0;
        let product_gemstones = await productgems(productobj.product_id)
        if(product_gemstones.length > 0)
        {
          gemstone_process(product_gemstones[0],vendor_code);
        }else
        {
          updategoldprice(product_obj.vendor_code, productsku)

        } 


        function gemstone_process(gemstoneobj,vendorcode)
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
        
        models.gemstone_price_settings.findAll({
              where: whereclause
          }).then(async gemstonecharge=> {
            var  gemstonemargin = 0;
            var  gemstonecost = 0;
            var  gemstonesell = 0;
            var cost_price_type = 0;
            var sell_price_type = 0;
            var sell_percent_flat = 0;
            
            console.log("gemstonepricesettings")
            console.log(JSON.stringify(gemstonecharge));
            gemstonecharge.forEach(pricingobj => {
              if(pricingobj.price_type == 1)
              {
                gemstonecost = pricingobj.price
                cost_price_type = pricingobj.rate_type;
                
              }else if(pricingobj.price_type == 2)
              {
                gemstonesell = pricingobj.price
                sell_price_type = pricingobj.rate_type;
                sell_percent_flat = pricingobj.selling_price_type
              }
    
            })
    
                if(cost_price_type == 1)
                {
                  if(gemstoneobj.stone_weight){
                    gemstonecost = gemstonecost * gemstoneobj.stone_weight
                  }
                }
                if(sell_price_type == 1)
                {
                  if(sell_percent_flat == 2)
                  {
                    gemstonesell = calculatepercentage(gemstonecost,gemstonesell)  
                  }else{
                    gemstonesell = gemstoneobj.stone_weight * gemstonesell
                  }
                  
                }else if(sell_price_type == 2)
                {
                  if(sell_percent_flat == 2)
                  {
                    gemstonesell = calculatepercentage(gemstonecost,gemstonesell)  
                  }else{
                  if(gemstoneobj.stone_weight){
                    gemstonesell = pricingobj.price * gemstoneobj.stone_weight
                  }
                }
                }
    
           /* if(gemstonecharge.selling_price_type == 3)
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
            */
            // let gemstonediscount =  await materialdiscountval('Gem Stone',gemstonesell)  
            // gemstonesell = calculatediscountmarkup(gemstonediscount, gemstonesell)
            var gemstone_whereclause ={
                material_name : 'gemstone'
            }
            gemstone_whereclause['price_min'] = { [Op.lte]: gemstonesell }
            gemstone_whereclause['price_max'] = { [Op.gte]: gemstonesell }
          let gemstone_markup =  await models.material_markups.findOne({
              where: gemstone_whereclause
            })
            if(gemstone_markup)
            {
              if(gemstone_markup.markup_type == 1)
              {
                gemstonesell = gemstone_markup.markup_value
              }
            }
            gemstonemargin = ((gemstonesell - gemstonecost)/gemstonecost)*100
    
            gemstone_count++;
        
            pricesplitup.push(gemstoneobj);



    
            var gemstoneprice ={
              component: 'gemstone'+gemstone_count,
              material_name: gemstoneobj.gemstone_type,
              id: uuidv1(),
              margin_percentage: gemstonemargin,
              cost_price:gemstonecost,
              selling_price:gemstonesell,
              markup:gemstonesell,
              discount_price:gemstonesell,
              product_sku: productskus[skucount].generated_sku,
              product_id: product_obj.product_id
            }  
           console.log("iamaheerertoodas"+JSON.stringify(gemstoneprice));
            models.pricing_sku_materials.findOne({
              where: {product_sku: productskus[skucount].generated_sku, material_name: gemstoneprice.material_name}
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
          })
        function isgemstoneexist()
        {
          console.log("skugemcount"+skucount)

          console.log("gemstonescount"+gemstone_count)
          console.log("productgemstonecount"+product_gemstones.length)

            if(product_gemstones.length > gemstone_count)
            {
              gemstone_process(product_gemstones[gemstone_count],product_obj.vendor_code)
            }else{
              
                  updategoldprice(product_obj.vendor_code, productsku)
            }
        }
        
        

        
      }
    
  
      }
    
    
      function updategoldprice(vendorcode, skuobj )
    {


        var purityval = skuobj.purity;
        models.gold_price_settings.findOne({

            where: {
              vendor_code: product_obj.vendor_code,
              purity: parseInt(purityval.replace('K',''))
            }
        }).then(async gold_price=> {
           if(gold_price)
           {
            costprice = gold_price.cost_price * skuobj.sku_weight
            if(gold_price.selling_price_type == 2)
            {
              sellingprice = calculatepercentage(costprice,gold_price.selling_price)  

            }else{
              sellingprice = gold_price.selling_price * skuobj.sku_weight
            }
            
              responseobj['goldprice'] = {
                costprice,
                sellingprice
              }
            var goldpriceobj = { }
              goldpriceobj['goldprice'] = {
                costprice,
                sellingprice
              }

            // let goldmarkup =  await materialmarkupval('Gold',sellingprice)  
            // sellingprice = calculatesellingmarkup(goldmarkup, sellingprice)
            
            let golddiscount1 =  await calculatediscountmarkup(product_obj,skuobj.generated_sku)  
             let golddiscount = golddiscount1[0]
              if(golddiscount)
              {
             if(golddiscount.goldprice_discount)
              {
              if(golddiscount.discount_type === 2)
              {
                sellingprice =  sellingprice - (sellingprice * golddiscount.goldprice_discount)/100;
              }else{

              }

            }
          }
            console.log("updatediscount>>>>>>>"+sellingprice)

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
                  console.log('iamhere')
                  makingcharge(vendorcode);
                })
                .catch(reason => {

                  makingcharge(vendorcode);
                });
              }
              else{
                models.pricing_sku_metals.create(goldprice).then((result) => {
                  makingcharge(vendorcode);
                })
                .catch((error) => {
                  console.log("errodmessage"+JSON.stringify(error.message))
                  makingcharge(vendorcode);
                });

              }
            })
          }else{
            makingcharge(vendorcode);
          }
              

    
        });

      }

      function makingcharge(vendorcode)
      {
        var mkcostprice = 0;
        var mksellingprice = 0;
        var skupurity = productskus[skucount].purity;
          models.making_charge_settings.findAll({
              where: {
                vendor_code: vendorcode,
                purity: parseInt(skupurity.replace('K','')),
                material: 'Gold',
                weight_start:{
                  [Op.lte]: productskus[skucount].sku_weight
                },
                weight_end:{
                  [Op.gte]: productskus[skucount].sku_weight
                }
               
              }
          }).then(async makingcharge=> {
            console.log(">>>>>>>>"+JSON.stringify(makingcharge))
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
                
              

              var makingchargeobj = {};
              makingchargeobj['makingcharge'] = {
                "costprice":mkcostprice,
                "sellingprice":mksellingprice,
                "markup":mksellingprice,
                "discount_price":mksellingprice

              }
              pricesplitup.push(makingchargeobj);
              var  makingmargin = ((mksellingprice - mkcostprice)/mkcostprice)*100
  
              var makingprice ={
                material_name: 'makingcharge',
                cost_price:mkcostprice,
                selling_price:mksellingprice,
                markup:mksellingprice,
                discount_price: mksellingprice,
                margin_percentage: makingmargin,
                product_sku: productskus[skucount].generated_sku
              }  
              models.pricing_sku_metals.findOne({
                where: {product_sku: productskus[skucount].generated_sku, material_name: 'makingcharge'}
              }).then(price_splitup_model=> {
                if (price_splitup_model) {
                  price_splitup_model.update(makingprice)
                  .then(async updatedmakingchargeprice => {
                   

                     updateskuprice();
                  })
                  .catch(reason => {
                         //  res.send(200,{"message":reason.message,price_splitup_model});

                    updateskuprice();
                  });
                }else{
                  models.pricing_sku_metals.create(makingprice).then(async (result) => {
                   
                   
                    // gemstonesell = calculatesellingmarkup(gemstonemarkup, gemstonesell)
                    updateskuprice();
                    

                  })
                  .catch((error) => {
                    console.log("makingchargeprice"+error.message)
                    
                    
                    updateskuprice();
                  });
                }
              })
            }else{
              updateskuprice()
            }
          });
      }
      function getmaterialmarkupsum(skuvalue)
      {
        return models.pricing_sku_materials.findOne({
          attributes: [
            [squelize.literal('SUM(markup)'), 'markup'],
            [squelize.literal('SUM(discount_price)'), 'discount_price']
          ],
          where: {
          product_sku: skuvalue
         
          }
      })
      }
      function getmetalmarkupsum(skuvalue)
      {
        return models.pricing_sku_metals.findOne({
          attributes: [
            [squelize.literal('SUM(markup)'), 'markup'],
            [squelize.literal('SUM(discount_price)'), 'discount_price']
          ],
          where: {
          product_sku: skuvalue
          }
          })
      }
       function updateskuprice()
      {

        
        
        models.pricing_sku_materials.findOne({
          attributes: [
            [squelize.literal('SUM(cost_price)'), 'cost_price'],
            [squelize.literal('SUM(selling_price)'), 'selling_price']
          ],
          where: {
          product_sku: productskus[skucount].generated_sku
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
            //let taxcomponent = await gettaxmaster('Rings');
           
          
            
             let markupobj =  await materialmarkupval(total_sellingprice)
            console.log('$$$$$$$$$$'+JSON.stringify(markupobj))
             if(markupobj.length > 0)
              {
                markupobj.forEach(async markup => {
                  if(markup.material == 'Diamond')
                  {
                    var query = "UPDATE pricing_sku_materials SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name ='"+productskus[skucount].diamond_type+"'" ;
                    await models.sequelize.query(query).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    })
                  }
                  if(markup.material == 'Gem Stone')
                  {
                    console.log('$$$$$$$$$$'+markup.markup_value)

                    var query = "UPDATE pricing_sku_materials SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and component LIKE 'gemstone%'" ;
                    await models.sequelize.query(query).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    })
                  }
                  if(markup.material == 'Making Charge')
                  {
                    var query = "UPDATE pricing_sku_metals SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name = 'makingcharge'" ;
                    await models.sequelize.query(query).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    })
                  }
                  if(markup.material == 'Gold')
                  {
                    var query = "UPDATE pricing_sku_metals SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name = 'goldprice'" ;
                    await models.sequelize.query(query).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    })
                  }
                });

              }

              var mkquery = "UPDATE pricing_sku_metals SET discount_price = ((markup * 100) /(100 - 25)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
             await models.sequelize.query(mkquery).then(([results, metadata]) => {
                // Results will be an empty array and metadata will contain the number of affected rows.
              })
              var materialquery = "UPDATE pricing_sku_materials SET discount_price = ((markup * 100)/(100 - 25)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
                  await  models.sequelize.query(materialquery).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    })
              // var query = "UPDATE pricing_sku_metals SET discount_price = (discount_price + (discount_price * 3/100)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
              // await  models.sequelize.query(query).then(([results, metadata]) => {
              //         // Results will be an empty array and metadata will contain the number of affected rows.
              //       })
              // var query1 = "UPDATE pricing_sku_materials SET discount_price = (discount_price + (discount_price * 3/100)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
              // await  models.sequelize.query(query1).then(([results, metadata]) => {
              //               // Results will be an empty array and metadata will contain the number of affected rows.
              //  })    
              

              let materialsum = await getmaterialmarkupsum(productskus[skucount].generated_sku)      
              let matalsum = await getmetalmarkupsum(productskus[skucount].generated_sku)      
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
                console.log("price updated")
                isskuexist()
              
            }).catch(reason => {
              console.log(reason)
            });;       


          });
      });
      }
      function updatemarkupvalue(query)
      {

      }


      
      function isskuexist()
      {

        console.log("i am here")
          skucount = skucount + 1;
          if(product_obj.trans_sku_lists.length > skucount)
          {
            console.log("i am here1")

        
              updatediamondprice(product_obj.vendor_code, product_obj.trans_sku_lists[skucount])

          }else{
            console.log("i am here2")

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