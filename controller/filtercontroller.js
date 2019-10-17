
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');

exports.filteroptions = async (req, res) => {
  

var master_category =    await models.master_product_categories.findAll({
  })



 var master_product_type = await models.product_lists.findAll({
    attributes: ['product_type'],
    group: ['product_type']
  })


    res.send(200,{master_category,master_product_type})
}