
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.updatesize = async (req, res) => {
    req.setTimeout(50000000);

  
var products =    await models.product_lists.findAll({
      
        where: {
        product_id : 'SR0279',
          isactive : true
        }
      })

      var uniquecolors =    await models.trans_sku_lists.findAll({
        attributes: ['metal_color'],
        group: ['metal_color'],
        where: {
            product_id : 'SR0279'
        }
      })   
      var uniquepurity =    await models.trans_sku_lists.findAll({
        attributes: ['purity'],
        group: ['purity'],
        where: {
            product_id : 'SR0279'
        }
      })  
      var prod_purity_varient = []
      products.forEach(prod_obj => {
          uniquepurity.forEach(purity_obj => {
            uniquecolors.forEach(color_obj => {
                prod_purity_varient.push(purity_obj.purity+' '+color_obj.metal_color);
            })
          })
          
      });
      
  
 
      res.send(200,{uniquecolors,uniquepurity,prod_purity_varient});
   
       

}