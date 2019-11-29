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
		attributes:['product_id','vendor_code'],
		where: whereclause1
	  }).then(product=> {
		req.products = product 
		next();
	  })


}

const producttransskus = async (productinfo, req, res, next ) => {
    var whereclause1 = {
        
    }
    
      whereclause1 = {
        product_id :  productinfo.product_id
        
      }
		let prod_skus = await	models.product_lists.findOne({
		attributes:['product_id','vendor_code'],
		include: [{
			model: models.trans_sku_lists,
		}],
		where: whereclause1
		})
		return prod_skus;
}


const skudiamond = async (product_id, diamondtype, req, res, next ) => {
	var whereclause1 = {
			
	}
	
		whereclause1 = {
			diamond_type: diamondtype,
			product_sku: product_id
			
		}
	let prod_sku_diamonds = await	models.product_diamonds.findAll({

		where: whereclause1
		})
	return prod_sku_diamonds;
}


const productPricing = {};
productPricing.productList = productList;
productPricing.producttransskus = producttransskus;
productPricing.skudiamond = skudiamond;

module.exports = productPricing;