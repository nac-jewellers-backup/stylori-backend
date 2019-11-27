
const models=require('./../models');
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
    products = req.products
    
   async function processproduct(processed_product_count)
    {
        if(products.length > processed_product_count)
        {
            
        }
    }


      res.send(200,{"products":products})

    
}