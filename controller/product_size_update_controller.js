
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.updatesize = async (req, res) => {
    req.setTimeout(50000000);

  let processcount = 0;
  res.send(200,"success");

var products =    await models.product_lists.findAll({
      
        where: {
          isactive : true
        }
      })
      processproduct()
     async function processproduct()
      {
      if(products.length > processcount)
      {
        const prod_id = products[processcount].product_id

      var uniquecolors =    await models.trans_sku_lists.findAll({
        attributes: ['metal_color'],
        group: ['metal_color'],
        where: {
            product_id : prod_id
        }
      })  
 
      var uniquepurity =   await models.trans_sku_lists.findAll({
        attributes: ['purity'],
        group: ['purity'],
        where: {
            product_id : prod_id
        }
      }) 


 
      let prod_purity_varient = []
          uniquepurity.forEach(purity_obj => {
            uniquecolors.forEach(color_obj => {
                prod_purity_varient.push(purity_obj.purity+' '+color_obj.metal_color);
            })
          })
          
      
      console.log("completed"+JSON.stringify(prod_purity_varient))

      var query = "UPDATE product_lists SET colour_varient = '"+prod_purity_varient.join(',')+"' where product_id ='"+prod_id+"'" ;
           await  models.sequelize.query(query).then(([results, metadata]) => {
                  console.log("completed"+processcount)
                  prod_purity_varient = [];
                  processcount++;
                  processproduct()
                  // Results will be an empty array and metadata will contain the number of affected rows.
                   })
  
      }else{
        console.log("request completed")
      }
   
       
  }
}