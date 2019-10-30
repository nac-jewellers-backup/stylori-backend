
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');
var request = require('request');
exports.updateproduct_gender = async (req, res) => {
    var product_count = 0
    var product_msters = await models.product_lists.findAll({
        attributes: ['product_id','gender']
      })
      res.send(200,{"message":"success"})

      updatemetalcolor(product_count)
      async function updatemetalcolor(product_count) {

        var product_id = product_msters[product_count].product_id
        var product_gender_obj = product_msters[product_count].gender
        if(product_gender_obj)
        {
        var product_gender_arr = product_gender_obj.split(',');

      
          var product_gender = []
          product_gender_arr.forEach(element => {
              const product_colour = {
                  id : uuidv1(),
                  gender_name: element,
                  product_id: product_id,
                  is_active: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
              }
              product_gender.push(product_colour)
          })
          await models.product_gender.bulkCreate(
           
            product_gender
              , {individualHooks: true})
              product_count++;
            if(product_msters.length > product_count)
            {
                updatemetalcolor(product_count)

            }else{
                console.log("finished")
            }
        }else{
            product_count++;
            if(product_msters.length > product_count)
            {
                updatemetalcolor(product_count)

            }else{
                console.log("finished")
            }
        }
      }
}
exports.updateproduct_color = async (req, res) => {
    var product_count = 0
    var product_msters = await models.product_lists.findAll({
        attributes: ['product_id']
      })
      res.send(200,{"message":"success"})

      updatemetalcolor(product_count)
      async function updatemetalcolor(product_count) {
        var product_id = product_msters[product_count].product_id
        var product_colors = await models.trans_sku_lists.findAll({
            attributes: ['metal_color'],
            group: ['metal_color'],
           where: {
                product_id: product_id
            }
          })
          var product_metal_colours = []
          product_colors.forEach(element => {
              const product_colour = {
                  id : uuidv1(),
                  product_color: element.metal_color,
                  product_id: product_id,
                  is_active: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
              }
              product_metal_colours.push(product_colour)
          })
          await models.product_metalcolours.bulkCreate(
           
            product_metal_colours
              , {individualHooks: true})
              product_count++;
            if(product_msters.length > product_count)
            {
                updatemetalcolor(product_count)

            }else{
                console.log("finished")
            }
      }
}
exports.updateproduct_purity = async (req, res) => {
    var product_count = 0
    var product_msters = await models.product_lists.findAll({
        attributes: ['product_id']
      })
      res.send(200,{"message":"success"})

      updatemetalcolor(product_count)
      async function updatemetalcolor(product_count) {
        var product_id = product_msters[product_count].product_id
        var product_colors = await models.trans_sku_lists.findAll({
            attributes: ['purity'],
            group:['purity'],
           where: {
                product_id: product_id
            }
          })
          var product_metal_colours = []
          product_colors.forEach(element => {
              const product_colour = {
                  id : uuidv1(),
                  purity: element.purity,
                  product_id: product_id,
                  is_active: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
              }
              product_metal_colours.push(product_colour)
          })
          await models.product_purities.bulkCreate(
           
            product_metal_colours
              , {individualHooks: true})
              product_count++;
            if(product_msters.length > product_count)
            {
                updatemetalcolor(product_count)

            }else{
                console.log("finished")
            }
      }
}


exports.updateproduct_stonecolor = async (req, res) => {
    var product_count = 0   
    var stonecolor_str = req.body.stonecount;
    var stonecolor_obj = JSON.parse(stonecolor_str)

      res.send(200,{"message":stonecolor_obj.length})

     
      stonecolor_obj.forEach(async element => {
          console.log(JSON.stringify(element))
              const product_stonecount = {
                  id : uuidv1(),
                  stonecount: element.stonecount,
                  product_id: element.product_id,
                  is_active: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
              }
              await models.product_stonecount.create(product_stonecount)

            })
    
         
}
exports.updatecodpincodes = async (req, res) => {
    console.log("I ma here")
    var pincodes = req.body.cod_pincode;
    var pincodes_obj = JSON.parse(pincodes)
    var process_pincode_count = 0
    res.send(200, {"message":"success"})

    processpincode(process_pincode_count)
   async function processpincode(process_pincode_count)
    {
        
        var pincode = pincodes_obj[process_pincode_count];
        console.log("I ma here"+pincode.pincode)

     await   models.pincode_master.update(
            
            {is_cod: true, max_cartvalue : pincode.maxlimit , min_cartvalue: pincode.maxlimit},
                {where: {
                pincode: pincode.pincode
                }
             }
            
        )
        process_pincode_count++ 
        if(pincodes_obj.length > process_pincode_count)
        {

          processpincode(process_pincode_count)
        }else{
              console.log("finished")
        }
    }
}

exports.updateurlparams = async (req, res) => {
    var pincodes = req.body.urlparams;
    var pincodes_obj = JSON.parse(pincodes)
    var process_pincode_count = 0
    res.send(200, {"message":"success"})

    processpincode(process_pincode_count)
   async function processpincode(process_pincode_count)
    {
        var pincode = pincodes_obj[process_pincode_count];
        var urlobj = {
            id:uuidv1(),
            attribute_name: pincode.name,
            attribute_value: pincode.value,
            seo_text: pincode.text,
            seo_value:pincode.value,
            seo_url:pincode.url,
            priority: pincode.priority,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        await models.seo_url_priorities.create(urlobj)
        process_pincode_count++ 
        if(pincodes_obj.length > process_pincode_count)
        {

          processpincode(process_pincode_count)
        }else{
              console.log("finished")
        }
    }
}

exports.updatepincode = async (req, res) => {
    var pincodes = req.body.delivery_pin_code;
    var pincodes_obj = JSON.parse(pincodes)
    var process_pincode_count = 0
    res.send(200, {"message":"success"})

    processpincode(process_pincode_count)
    function processpincode(process_pincode_count)
    {
        var pincode = pincodes_obj[process_pincode_count].pincode;
        console.log(pincode)
        request({
        url: 'http://www.postalpincode.in/api/pincode/'+pincode,
        method: "GET",
        headers: {},
        body: ""
    }, async function(error, response, body) {
        var res_obj = JSON.parse(response.body)
        if(res_obj && res_obj.PostOffice)
        {
        var post_offices = res_obj.PostOffice;

        console.log(JSON.stringify(res_obj.PostOffice))
        var postoffices_arr =[];
        post_offices.forEach(element => {
            const post_off_obj ={
                id: uuidv1(),
                pincode: pincode,
                area:element.Name,
                district: element.District,
                state: element.State,
                country: element.Country,
                lat:0,
                lng:0,
                is_cod: true,
                is_delivery: true,
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            postoffices_arr.push(post_off_obj)
        });
        await models.pincode_master.bulkCreate(
           
            postoffices_arr
              , {individualHooks: true})
              process_pincode_count++ 
              if(pincodes_obj.length > process_pincode_count)
              {

                processpincode(process_pincode_count)
              }else{
                    console.log("finished")
              }
        }else{
            process_pincode_count++ 
            if(pincodes_obj.length > process_pincode_count)
            {

              processpincode(process_pincode_count)
            }else{
                  console.log("finished")
            }
        }
    });

}

}