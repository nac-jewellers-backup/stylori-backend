const jwt = require('jsonwebtoken');
import 'dotenv/config';
const models=require('./../models');
const Op= require('sequelize').Op;

const productList = (req, res, next) => {
	const {req_product_id} = req.body
    var whereclause1 = {
        
    }
    if(req_product_id)
    {
      var product_id_arr1 = req_product_id.split(',');
      whereclause1 = {
        product_id : {
          [Op.in]: product_id_arr1
        }
      }


	}
	
	models.product_lists.findAll({
		attributes:['product_id'],
		where: whereclause1
	  }).then(product=> {
		req.products = product 
		next();
	  })


}

const product = (productid) => {
	const {req_product_id} = req.body
    var whereclause1 = {
        
    }
    if(req_product_id)
    {
      var product_id_arr1 = req_product_id.split(',');
      whereclause1 = {
        product_id : {
          [Op.in]: product_id_arr1
        }
      }


	}
	
	models.product_lists.findAll({
		attributes:['product_id'],
		where: whereclause1
	  }).then(product=> {
		req.products = product 
		next();
	  })


}


const productPricing = {};
productPricing.productList = productList;
module.exports = productPricing;