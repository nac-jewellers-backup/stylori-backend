
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const squelize= require('sequelize');
const uuidv1 = require('uuid/v1');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
exports.priceupdate = (req, res) => {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {}
    var responseobj = {};
    var pricesplitup = []
    var products = []
    var processed_product_count = 0;
    res.send(200,{message:"success"})
    const {req_product_id} = req.body
    var whereclause1 = {
      isactive : true,
      // product_id: {
      //   [Op.iLike]: '%SR%'
      // }
    }
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

    const msg = {
      to: "manokarantk@gmail.com",
      subject: 'Pricing update started',
      from: 'info@ustimeapp.com',
      html: "<b>started</>"
      };
    //  sgMail.send(msg);
    models.product_lists.findAll({
     
      where: whereclause1
    }).then(product=> {
     
      products = product;
      console.log(">>>>>>>"+JSON.stringify(whereclause1))
         processproduct()
    });
    var start = 0;
    async function processproduct(){
      console.log(">>>><<<<<<>>>>><<<<<<"+processed_product_count)
      

      
    }

  


  

  


 



  

  


  
   

    
  
 
}