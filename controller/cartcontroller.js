import crypto from 'crypto-random-string';
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const models=require('./../models');
import 'dotenv/config';
const squelize= require('sequelize');
const Op= require('sequelize').Op;
const uuidv1 = require('uuid/v1');
import aws from 'aws-sdk'; 
import dotenv from 'dotenv';

dotenv.config();
aws.config.update({
    region: 'ap-south-1', // Put your aws region here
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  });
  const S3_BUCKET = process.env.AWS_IMAGE_BUCKET_NAME;

exports.addtocart = async (req, res) => {
 let {user_id, products,cart_id} = req.body
 console.log(JSON.stringify(req.body));
  if (!cart_id)
  {
    const cartobj = {
        id : uuidv1(),
        userprofile_id: user_id
    }
    let new_cart = await models.shopping_cart.create(cartobj,{
        returning: true
      })
    cart_id = new_cart.id 
  
  }

  let cartlines = [] 
  products.forEach(element => {
      const lineobj = {
          id:uuidv1(),
          shopping_cart_id: cart_id,
          product_sku: element.sku_id,
          qty: element.qty,
          price: element.price
      }
      cartlines.push(lineobj)
  });
  await models.shopping_cart_item.bulkCreate(
      cartlines
        , {individualHooks: true}).then(function(response){
            
  })

 let gross_amount = await models.shopping_cart_item.findOne({
    attributes: [
      [squelize.literal('SUM(price)'), 'price']
    ],
    where: {
        shopping_cart_id: cart_id
    }
    })
    models.shopping_cart.update({gross_amount:gross_amount.price},{
        where: {id: cart_id}
        }).then(price_splitup_model=> { 
        res.send(200,{cart_id})
      }).catch(reason => {
        console.log(reason)
      });




}
exports.uploadimage =  (req, res) => {
    console.log(req.body)
    const s3 = new aws.S3();  // Create a new instance of S3
  const fileName = uuidv1()+'.'+req.body.image;
  const fileType = req.body.image;
  console.log(fileName)

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(data);
      res.json({success: false, error: err});
      return false;
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    // Send it all back
    res.json({success:true, data:{returnData}});
  });
}
exports.addaddress = async (req, res) => {
    let {user_id, address,cart_id} = req.body
    
    let address_arr = [];
    address.forEach(element => {
        const address_obj = {
            cart_id:cart_id,
            userprofile_id:user_id,
            firstname:element.firstname,
            lastname:element.lastname,
            pincode:element.pincode,
            addressline1:element.addressline1,
            addressline2:element.addressline2,
            city:element.city,
            state:element.state,
            country:element.country,
            country_code:element.country_code,
            contact_number:element.contactno,
            address_type:element.addresstype
        }
        address_arr.push(address_obj)

    })
    models.cart_addresses.bulkCreate(
        address_arr
          , {individualHooks: true}).then(function(response){
      res.send(200,{"message":"updated successfully"})        
    }).catch(reason => {
        res.send(500,{"message":"Error Please try again"}) 
        console.log(reason)
      });
   
   
   
   }
