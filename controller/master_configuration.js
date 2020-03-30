
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
                short_code : shortCode},
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
            short_code : shortCode ,
            }
        await   models.master_product_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managecategories = async (req, res) => {
    const {id,name,shortCode,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_product_categories.update(
            
            {name: name, 
                short_code : shortCode},
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
            short_code : shortCode ,
            }
        await   models.master_product_categories.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managematerials = async (req, res) => {
    const {id,name,shortCode,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_product_types.update(
            
            {name: name, 
                short_code : shortCode},
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
            short_code : shortCode ,
            }
        await   models.master_product_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.managegenders = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_genders.update(
            
            {   name: name 
                },
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
            alias : name ,
            }
        await   models.master_genders.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.managegemtypes = async (req, res) => {
    const {id,name,colorCode,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_gemstones_types.update(
            
            {   
                name: name,
                color_code:  colorCode
                },
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
            alias : name ,
            color_code: colorCode
            }
        await   models.master_gemstones_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managegemshapes = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_gemstones_shapes.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_gemstones_shapes.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}
exports.managegemsettings = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_gemstones_settings.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_gemstones_settings.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.managediamondtypes = async (req, res) => {
    const {id,diamondClarity,diamondColor,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_diamond_types.update(
            
            {   
                diamond_clarity: diamondClarity,
                diamond_color : diamondColor
                },
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
            diamond_clarity: diamondClarity,
            diamond_color : diamondColor,
            short_code : ""
            }
        await   models.master_diamond_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managediamondsettings = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_diamonds_settings.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_diamonds_settings.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managediamondshapes = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_diamonds_shapes.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_diamonds_shapes.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managedesigns = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_designs.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_designs.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managecollections = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_collections.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_collections.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managepurities = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_metals_purities.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_metals_purities.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.managemetalcolors = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_metals_colors.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_metals_colors.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managematerials = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_materials.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_materials.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.manageearring = async (req, res) => {
    const {id,name,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_earring_backing.update(
            
            {   
                name: name
                },
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
            alias : name 
            }
        await   models.master_earring_backing.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managemasterattributes = async (req, res) => {
    const {id,name,isFilter,filterPosition,isdelete,isedit} = req.body
    if(isedit)
    {
        await   models.Attribute_master.update(
            
            {   
                name: name,
                is_filter: isFilter,
                filter_position : filterPosition,
                },
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
            is_filter: isFilter,
            filter_position : filterPosition,
            is_active: true,
            shortCode : "",
            }
        await   models.Attribute_master.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}