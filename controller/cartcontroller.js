import crypto from 'crypto-random-string';
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const models=require('./../models');
import 'dotenv/config';
const squelize= require('sequelize');
const Op= require('sequelize').Op;
const uuidv1 = require('uuid/v1');

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
