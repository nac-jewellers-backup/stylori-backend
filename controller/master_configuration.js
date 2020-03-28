
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');
var request = require('request');

exports.managetaxsetup = async (req, res) => {
    const {id,taxName,taxValue,hsnNumber,igst,cgst,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_tax_settings.update(
            
            {tax_name: taxName, 
            tax_value : taxValue ,
            hsn_number: hsnNumber,
            IGST: igst,
            CGST:cgst},
                {where: {
                id: id
                }
             }
            
        )
        res.send(200,{"message":"Updated Successfully"})
    }else if(isdelete)
    {

    }else{
        let taxobj ={
            id:uuidv1(),
            tax_name: taxName, 
            tax_value : taxValue ,
            hsn_number: hsnNumber,
            IGST: igst,
            CGST:cgst}
        await   models.master_tax_settings.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }
}

exports.manageproducttypes = async (req, res) => {
    const {id,name,shortCode,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_product_types.update(
            
            {name: name, 
                shortCode : shortCode},
                {where: {
                id: id
                }
             }
            
        )
        res.send(200,{"message":"Updated Successfully"})
    }else if(isdelete)
    {

    }else{
        let taxobj ={
            id:uuidv1(),
            name: name, 
            shortCode : shortCode ,
            }
        await   models.master_product_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}