
const models=require('./../models');
import 'dotenv/config';
import {sendMail} from "./notify/user_notify"
import { write } from 'fs';
const Op= require('sequelize').Op;
var Sequelize = require('sequelize');
const uuidv1 = require('uuid/v1');
var fs = require("fs");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
exports.priceupdate = (req, res) => {
  console.log("test")
  function writelog(message)
  {
    message = message + '\n'
    fs.appendFile("./price_update.txt", message, (err) => {
      if (err) console.log(err);
    //  console.log("Successfully Written to File.");
     
    });
    
  }
  var skuwhereclause = {}
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {}
    var responseobj = {};
    var pricesplitup = []
    var products = []
    var product_ids = []
    var pricing_comp = []
    var discount_percentage = 0
    var processed_product_count = 0;
    res.send(200,{message:"success"})
    const {req_product_id, vendorcode,category,product_type,metalpurity,product_category,pricingcomponent,purity,sizes,diamondtypes} = req.body
    var whereclause1 = {
      isactive : true,
      product_id: {
        [Op.iLike]:'%SGC%'
      }
    }
    console.log(":>>>>>>>>>1212")
   var  startDate = new Date()
    console.log(new Date())
    if(req_product_id)
    {
      var product_id_arr1 = req_product_id.split(',');
      
      // whereclause1 = {
      //   product_id : req_product_id

      // }
      whereclause1 = {
        product_id : {
          [Op.in]: product_id_arr1
        }
      }


    }
    let vendor_arr = []

    if(vendorcode)
    {
      vendorcode.forEach(element => {
        vendor_arr.push(element.shortCode)
      })
     
      whereclause1['vendor_code'] = {
        [Op.in] : vendor_arr
      }
    }

    if(pricingcomponent)
    {
      pricingcomponent.forEach(element => {
          pricing_comp.push(element)
      })
    }

   
    let purity_arr = [];
    
    if(purity)
    {
      metalpurity.forEach(element => {
        purity_arr.push(element.alias)
      })
      skuwhereclause['purity'] = {
        [Op.in] : purity_arr
      }
    }
    let sku_size_arr = []
    if(sizes)
    {
      sizes.forEach(elemet => {
        sku_size_arr.push(elemet.sku_size)
      })
      skuwhereclause['sku_size'] = {
        [Op.in] : sku_size_arr
      }
    }
    // skuwhereclause['generated_sku'] = {
    //   [Op.eq] : 'SR0771-18140000-13'
    // }
    // skuwhereclause['discount_price'] = {
    //   [Op.eq] : 25
    // }
    // skuwhereclause['is_active'] = {
    //   [Op.eq] : true
    // }
    let diamond_type_arr = []
    if(diamondtypes)
    {
      diamondtypes.forEach(element => {
        diamond_type_arr.push(element.label)
      })
     
      skuwhereclause['diamond_type'] = {
        [Op.in] : diamond_type_arr
      }
    }
    let product_category_arr = [];

    if(category)
    {
       category.forEach(element => {
        product_category_arr.push(element.name)
      })
      whereclause1['product_category'] = {
        [Op.in] : product_category_arr
      }
    }
   
    let product_type_arr = []
    if(product_type)
    {
       product_type.forEach(element => {
        product_type_arr.push(element.name)
      })
      whereclause1['product_type'] = {
        [Op.in] : product_type_arr
      }
    }

    console.log(">>>>")
    console.log(JSON.stringify(product_type_arr))
    



    const msg = {
      to: "manokarantk@gmail.com",
      subject: 'Pricing update started',
      from: 'info@ustimeapp.com',
      html: "<b>started</>"
      };
    //  sgMail.send(msg);
    models.product_lists.findAll({
      // include: [{
      //   model: models.trans_sku_lists,
      //   where:{
      //       generated_sku: 'SB0013-18230000'
      //   }
      //  },
       
      //  {
      //   model: models.product_diamonds,

      //  },
      //  {
      //   model: models.product_gemstones,

      //  },
      //  {
      //   model: models.product_occassions,

      //  },{
      //   model: models.product_styles,

      //  },
      //  {
      //   model: models.product_themes,

      //  }
      // ],
      where: whereclause1,
      offset: 0
        }).then(product=> {
     
      products = product;
      console.log(">>>>>>>"+JSON.stringify(product.length))

      // pricingresult()
   //res.send(200, products[0]);
       processproduct()
    });
    var start = 0;
    async function processproduct(){
      console.log(">>>><<<<<<>>>>><<<<<<"+processed_product_count)

      if(products.length > processed_product_count)
      {
        
         start = new Date()

        let currentproduct = products[processed_product_count]
        product_ids.push(currentproduct.product_id)
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
           
       
      }else{
       // res.send(200,{message: "succes1s"})
      //  processed_product_count = processed_product_count  + 1;
      //  processproduct();

        const msg = {
        to: "manokarantk@gmail.com",
        subject: 'Pricing update finished',
        from: 'info@ustimeapp.com',
        html: "<b>ended</>"
        };
      //  sgMail.send(msg);
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
                //  isskuexist()
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
      var sku_component_count = 0
      var diamond_component_count = 0
      var gemstone_component_count = 0

      console.log("processlength"+product_obj.trans_sku_lists.length)
      updatediamondprice(productobj.vendor_code, productskus[0])
   //updateskuprice()
   // updategoldprice(productobj.vendor_code, productskus[0])
   function checkisinclude()
   {
      if(pricing_comp.indexOf("Diamond") > -1)
      {

      }
      if(pricing_comp.indexOf("Gemstone") > -1)
      {
        updategemstone_price(product_obj.vendor_code, productsku)

      }
      if(pricing_comp.indexOf("Gold") > -1)
      {
        updategoldprice(product_obj.vendor_code, productsku)
      }
      if(pricing_comp.indexOf("Making Charge") > -1)
      {
        
      }
    }

    async  function updatediamondprice(vendor_code,productsku)
     {
      console.log("log diamond update")

      var costprice_diamond = 0;
      var sellingprice_diamond = 0;
      var processcount = 0;
       var diamondprice1 = []
        let product_diamonds = await productdiamonds(productsku.product_id,productsku.diamond_type)
        sku_component_count = 0
        diamond_component_count = product_diamonds.length
        if(product_diamonds.length > 0)
        {
        //  sku_component_count++;
          diamond_process(product_diamonds[0],vendor_code);
        }else
        {
        
        updategemstone_price(product_obj.vendor_code, productsku)

       }

       function diamond_process(diamondobj,vendorcode)
       {
          var conditionobj = {
             vendor_code: vendorcode,
               diamond_colour: diamondobj.diamond_clarity,
               diamond_clarity: diamondobj.diamond_colour
          }
          
          writelog("diamondpriceseeting")
          writelog(JSON.stringify(conditionobj))
          
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
            
              writelog(product_obj.product_id)
              writelog("diamond cost price")
              writelog(diamondcost)

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
                      writelog("diamondexist")
                      price_splitup_model.update(diamondprice)
                        .then(updatedmakingchargeprice => {
                      isdiamondexist()
                    })
                    .catch(reason => {
                      isdiamondexist()
                    });
                  }else{
                    models.pricing_sku_materials.create(diamondprice).then((result) => {
                      writelog("newdiamond")
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
                function isdiamondexist()
                {
                  if(product_diamonds.length > processcount)
                  {
                  
                  diamond_process(product_diamonds[processcount],vendorcode)
                  }else{
                  //  updateskuprice() 
                 // updateskuprice()
                   updategemstone_price(product_obj.vendor_code, productsku)
                  //  isskuexist()
  
                  }
                }
                
            });
          
  
  
        }
      };
    

    async  function updategemstone_price(vendor_code,productsku)
      {
        console.log("log gemstone update")

        var  gemstonemargin = 0;
        var  gemstonecost = 0;
        var  gemstonesell = 0;
        var  gemstone_count = 0;
        var cost_price_type = 0;
        var sell_price_type = 0;
        var sell_percent_flat = 0;
        let product_gemstones = await productgems(productobj.product_id)
        gemstone_component_count =  product_gemstones.length 
        if(product_gemstones.length > 0)
        {

          sku_component_count++;
          gemstone_process(product_gemstones[0],vendor_code);
          
        }else
        {
          //checkisinclude()
         // isskuexist()
          updategoldprice(product_obj.vendor_code, productsku)

        } 


        function gemstone_process(gemstoneobj,vendorcode)
       {
       
        var whereclause = {
          vendor_code: vendorcode,
          gemstone_type: {
            [Op.iLike]: gemstoneobj.gemstone_type
          }
        }
     
        if(gemstoneobj.stone_weight)
        {
          var stoneweight = gemstoneobj.stone_weight/ gemstoneobj.stone_count
          whereclause['weight_start'] = { [Op.lte]: stoneweight }
          whereclause['weight_end'] = { [Op.gte]: stoneweight }
        }else
        {
          whereclause['rate_type'] = 2
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
                  }else{
                    gemstonecost = gemstonecost * gemstoneobj.stone_count

                  }
                }else
                {

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
                  if(gemstoneobj.stone_count)
                  {
                    gemstonesell = gemstoneobj.stone_count * gemstonesell
                  }
                }
    
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
              product_sku: productsku.generated_sku,
              product_id: product_obj.product_id
            }  
            models.pricing_sku_materials.findOne({
              where: {product_sku: productsku.generated_sku, component: gemstoneprice.component}
            }).then(price_splitup_model=> {
           
              if (price_splitup_model) {
                console.log("i am model data")

                var  gemstonemargin1 = (((gemstonesell + (price_splitup_model.markup)) - gemstonecost)/gemstonecost)*100
                gemstoneprice['margin_percentage'] = gemstonemargin1;
                price_splitup_model.update(gemstoneprice)
                .then(updatedmakingchargeprice => {
                  console.log("i am here")
                  isgemstoneexist()
                })
                .catch(reason => {
                  console.log("i am here for error")

                  isgemstoneexist()
                });
              }else{
                console.log("i am non model data")

                models.pricing_sku_materials.create(gemstoneprice).then((result) => {
                  isgemstoneexist()
                })
                .catch((error) => {
                  
                  isgemstoneexist()
                });
              }
             // isgemstoneexist()
            })
          })
        function isgemstoneexist()
        {
          console.log("gem count")
          console.log(gemstone_count)
          console.log(product_gemstones.length)
            if(product_gemstones.length > gemstone_count)
            {
              gemstone_process(product_gemstones[gemstone_count],product_obj.vendor_code)
            }else{
              // isskuexist()  
              //  checkisinclude();
               updategoldprice(product_obj.vendor_code, productsku)
            }
        }
        
        

        
      }
    
  
      }
    
    
      function updategoldprice(vendorcode, skuobj )
    {

      console.log("log gold update")

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
            let markupprice = 0;
            let golddiscount1 =  await calculatediscountmarkup(product_obj,skuobj.generated_sku)  
             let golddiscount = golddiscount1[0]
              if(golddiscount)
              {
             if(golddiscount.goldprice_discount)
              {
              if(golddiscount.discount_type === 2)
              {
                markupprice =  sellingprice - (sellingprice * golddiscount.goldprice_discount)/100;
              }else{

              }

            }
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
                 // checkisinclude()
                  makingcharge(vendorcode);
                })
                .catch(reason => {
                 // checkisinclude()

                  makingcharge(vendorcode);
                });
              }
              else{
                models.pricing_sku_metals.create(goldprice).then((result) => {
                  makingcharge(vendorcode);
                //checkisinclude()


                })
                .catch((error) => {
                  //checkisinclude()

                  makingcharge(vendorcode);
                });

              }
            })
          }else{
         //   checkisinclude()

          makingcharge(vendorcode);
          }
            

    
        });

      }

      function makingcharge(vendorcode)
      {
        var mkcostprice = 0;
        var mksellingprice = 0;
        let skuobj = product_obj.trans_sku_lists[skucount]

        var skupurity = skuobj.purity;
        console.log("log mkcharge update")
          models.making_charge_settings.findAll({
              where: {
                vendor_code: vendorcode,
                purity: parseInt(skupurity.replace('K','')),
                material: 'Gold',
                weight_start:{
                  [Op.lte]: skuobj.sku_weight
                },
                weight_end:{
                  [Op.gte]: skuobj.sku_weight
                }
               
              }
          }).then(async makingcharge=> {
            if(makingcharge)
            {
              sku_component_count++;
              makingcharge.forEach(makingcharge_obj => {
                if(makingcharge_obj.price_type == 1)
                {
                  if(makingcharge_obj.rate_type == 1)
                    {
                      mkcostprice =    makingcharge_obj.price
      
                    }else 
                    {
                      mkcostprice =   (skuobj.sku_weight * makingcharge_obj.price)
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
                      mksellingprice =    (skuobj.sku_weight * makingcharge_obj.price)
      
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
                product_sku: skuobj.generated_sku
              }  
              
              models.pricing_sku_metals.findOne({
                where: {product_sku: skuobj.generated_sku, material_name: 'makingcharge'}
              }).then(price_splitup_model=> {
                if (price_splitup_model) {
                  price_splitup_model.update(makingprice)
                  .then(async updatedmakingchargeprice => {
                   console.log("log1")
                      // if(product_obj.trans_sku_lists.length > skucount)
                      // {
                      //   isskuexist()

                      // }else{
                      //   processproduct()
                      // }
                    // isskuexist()
                     updateskuprice();
                  })
                  .catch(reason => {
                         //  res.send(200,{"message":reason.message,price_splitup_model});
                         console.log("log2")

                        // isskuexist()
                    updateskuprice();
                  });
                }else{
                  models.pricing_sku_metals.create(makingprice).then(async (result) => {
                    console.log("log3")

                    //isskuexist()
                    // gemstonesell = calculatesellingmarkup(gemstonemarkup, gemstonesell)
                   updateskuprice();
                    

                  })
                  .catch((error) => {
                    console.log("log4")
                   //isskuexist()
                    updateskuprice();
                  });
                }
              })
            }else{
              console.log("log5")

              isskuexist()
            }
            
          });
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
      async function updateskuprice()
      {
        sku_component_count = 0
        var coponentarray = []

     

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
       

          var makingchargemarkupvalue = makingsellingprice;
          var makingchargediscountvalue = ((makingchargemarkupvalue * 100) /(100 - discount_percentage));
          var diamondmarkupvalue = diamondsellingprice;
          var gemstonemarkupvalue = gemstonesellingprice;

          var gemstonediscountvalue = ((gemstonesellingprice * 100) /(100 - discount_percentage));
          var diamonddiscountvalue = ((diamondsellingprice * 100) /(100 - discount_percentage));

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
                    makingchargediscountvalue = ((makingchargemarkupvalue * 100) /(100 - discount_percentage));

                    var query = "UPDATE pricing_sku_metals SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name = 'makingcharge'" ;
                    await models.sequelize.query(query).then(([results, metadata]) => {
                     
                    })
                  } 
                  if(markup.material == 'Gem Stone')
                  {
                    gemstonemarkupvalue = (gemstonesellingprice + (gemstonesellingprice * (markup.markup_value/100)))
                    gemstonediscountvalue = ((gemstonemarkupvalue * 100) /(100 - discount_percentage));
                    var query = "UPDATE pricing_sku_materials SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and component LIKE 'gemstone%'" ;
                    await models.sequelize.query(query).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    })
                  } 
                  
                  if(markup.material == 'Diamond')
                  {
                    diamondmarkupvalue = (diamondsellingprice + (diamondsellingprice * (markup.markup_value/100)))
                    diamonddiscountvalue = ((diamondmarkupvalue * 100) /(100 - discount_percentage));
                    var query = "UPDATE pricing_sku_materials SET markup = (selling_price + (selling_price *"+markup.markup_value+"/100)) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name ='"+productskus[skucount].diamond_type+"'" ;
                    await models.sequelize.query(query).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    })
                  }


          });

          var golddiscountvalue = ((goldmarkupvalue * 100) /(100 - discount_percentage));
      

          var golddiscount_different = golddiscountvalue - goldmarkupvalue;

        var total_sku_discountvalue = golddiscountvalue + makingchargediscountvalue + diamonddiscountvalue + gemstonediscountvalue;

        var golddiscount_percentage = golddiscountvalue/total_sku_discountvalue;
        var makingcharge_percentage = makingchargediscountvalue/total_sku_discountvalue;
     

        var diamond_percentage = diamonddiscountvalue/total_sku_discountvalue;
        var gemstone_percentage = gemstonediscountvalue/total_sku_discountvalue;
      
           

        var discount_price_distribute_percentage = golddiscount_percentage/sku_component_count;
        if(makingchargediscountvalue > 0)
         {
          makingchargediscountvalue = makingchargediscountvalue + (golddiscount_different * (discount_price_distribute_percentage + makingcharge_percentage));
        }
         if(gemstonediscountvalue > 0)
         {
          gemstonediscountvalue = gemstonediscountvalue + (golddiscount_different * (discount_price_distribute_percentage + gemstone_percentage));

         }
         golddiscountvalue = goldmarkupvalue;
         if(diamonddiscountvalue > 0)
         {
         diamonddiscountvalue = diamonddiscountvalue + (golddiscount_different * (discount_price_distribute_percentage + diamond_percentage));
         }
         
         total_sku_discountvalue = makingchargediscountvalue + golddiscountvalue + gemstonediscountvalue + diamonddiscountvalue;

        
        var mkquery = "UPDATE pricing_sku_metals SET discount_price = ((markup * 100) /(100 - "+discount_percentage+") + ("+golddiscount_different+" * ("+discount_price_distribute_percentage+" + "+makingcharge_percentage+" ))) where product_sku ='"+productskus[skucount].generated_sku+"' and material_name = 'makingcharge'" ;
          await models.sequelize.query(mkquery).then(([results, metadata]) => {
             // Results will be an empty array and metadata will contain the number of affected rows.
           })
           if(diamond_component_count > 0)
                 {
               var materialquery = "UPDATE pricing_sku_materials SET discount_price = ((markup * 100) /(100 - "+discount_percentage+") + ("+golddiscount_different+" * (("+discount_price_distribute_percentage+" + "+diamond_percentage+" )/"+diamond_component_count+"))) where product_sku ='"+productskus[skucount].generated_sku+"' and component ilike '%diamond%'" ;
               await  models.sequelize.query(materialquery).then(([results, metadata]) => {
                   // Results will be an empty array and metadata will contain the number of affected rows.
                 })
                }
                 if(gemstone_component_count > 0)
                 {
          var materialquery = "UPDATE pricing_sku_materials SET discount_price = ((markup * 100) /(100 - "+discount_percentage+") + ("+golddiscount_different+" * (("+discount_price_distribute_percentage+" + "+gemstone_percentage+" )/"+gemstone_component_count+"))) where product_sku ='"+productskus[skucount].generated_sku+"' and component ilike '%gemstone%' " ;
               await  models.sequelize.query(materialquery).then(([results, metadata]) => {
                   // Results will be an empty array and metadata will contain the number of affected rows.
                 })
                }
                

           /* let total_costprice = accs.cost_price + product_splitup.cost_price;
            let total_sellingprice = accs.selling_price + product_splitup.selling_price;
            let sku_margin = ((total_sellingprice - total_costprice)/total_costprice)*100
            //let taxcomponent = await gettaxmaster('Rings');
           
            var gold_markup_price = 0
            
             let markupobj =  await materialmarkupval(total_sellingprice)
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
                  models.sequelize.query(query).then(([results, metadata]) => {
                   
                    // Results will be an empty array and metadata will contain the number of affected rows.
                    })
                  }
                });

              }

              
              console.log("goldmarkupprice*****")
              console.log(JSON.stringify(gold_markup_price))

              var mkquery = "UPDATE pricing_sku_metals SET discount_price = ((markup * 100) /(100 - 25)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
             await models.sequelize.query(mkquery).then(([results, metadata]) => {
                // Results will be an empty array and metadata will contain the number of affected rows.
              })
              var materialquery = "UPDATE pricing_sku_materials SET discount_price = ((markup * 100)/(100 - 25)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
                  await  models.sequelize.query(materialquery).then(([results, metadata]) => {
                      // Results will be an empty array and metadata will contain the number of affected rows.
                    }) */
              // var query = "UPDATE pricing_sku_metals SET discount_price = (discount_price + (discount_price * 3/100)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
              // await  models.sequelize.query(query).then(([results, metadata]) => {
              //         // Results will be an empty array and metadata will contain the number of affected rows.
              //       })
              // var query1 = "UPDATE pricing_sku_materials SET discount_price = (discount_price + (discount_price * 3/100)) where product_sku ='"+productskus[skucount].generated_sku+"'" ;
              // await  models.sequelize.query(query1).then(([results, metadata]) => {
              //               // Results will be an empty array and metadata will contain the number of affected rows.
              //  })    
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


      //     });
      // });
      }
      function updatemarkupvalue(query)
      {

      }

      async  function sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
      }
      
    async function isskuexist()
      {

       
       // Sequelize.close()
          skucount = skucount + 1;
          console.log("processsku"+skucount)
          console.log("processsku"+product_obj.trans_sku_lists.length)

          if(product_obj.trans_sku_lists.length > skucount)
          {

         //  updateskuprice()
          // Sequelize = require('sequelize')

             updatediamondprice(product_obj.vendor_code, product_obj.trans_sku_lists[skucount])

          }else{
            //skucount = 0
            console.log("i am here12")
            var endDate   = new Date();
            var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            startDate = new Date()
            console.log("prcesstime"+seconds)
            
            processed_product_count = processed_product_count  + 1;
            
            if((processed_product_count > 0 && processed_product_count%25 == 0))
            {
              var emilreceipiants = [{to : "manokarantk@gmail.com"},{to : "dineshtawker@gmail.com"}]
         
              sendMail(emilreceipiants,JSON.stringify(product_ids))
            }
            console.log(JSON.stringify(product_ids))
            await sleep(1000)
            processproduct()
              ;
            
          }
      }
    }
    function calculatepercentage(priceval , percentageval)
    {
      return (priceval + priceval *(percentageval/100))
    }
   

    
  
 
}