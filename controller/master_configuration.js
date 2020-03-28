
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
import apidata from './apidata.json';
const uuidv1 = require('uuid/v1');
var splitArray = require('split-array');
var request = require('request');

exports.managetaxsetup = async (req, res) => {
    const {id,taxName,taxValue,hsnNumber,IGST,CGST,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_tax_settings.update(
            
            {tax_name: taxName, 
            tax_value : taxValue ,
            hsn_number: hsnNumber,
            IGST: IGST,
            CGST:CGST},
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
            IGST: IGST,
            CGST:CGST}
        await   models.master_tax_settings.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}