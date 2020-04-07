
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
exports.managetaxsetup2 = async (req, res) => {
    const {id,name,value,hsnCode,igst,cgst,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.taxsettings.update(
            
            {name: name, 
                value : value ,
            hsn_code: hsnCode,
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
            name: name, 
            value : value ,
            hsn_code: hsnCode
        }
        await   models.taxsettings.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }
}
exports.manageproducttypes = async (req, res) => {
    const {id,name,shortCode,displayOrder,isFilter,isActive,certificate,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_product_types.update(

            {name: name, 
                certificate:certificate,
                short_code : shortCode,
                display_order:displayOrder,
                is_filter : isFilter,
                is_active : isActive
                },
                {where: {
                id: id
                }
             }
            
        )
        res.send(200,{"message":"Updated Successfully"})
    }else if(isdelete)
    {
        await   models.master_product_types.update(
                        {
                            is_active : isActive
                            },
                            {where: {
                            id: id
                            }
                        }
                    )
    }else{
        let taxobj ={
            id:uuidv1(),
            name: name, 
            certificate:certificate,
            display_order:displayOrder,
            short_code : shortCode ,
            }
        await   models.master_product_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managecategories = async (req, res) => {
    const {id,name,shortCode,isedit,isdelete,isFilter,isActive,filterOrder} = req.body
    if(isedit)
    {
        await   models.master_product_categories.update(
            
            {name: name, 
                short_code : shortCode,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            short_code : shortCode,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder
            }
        await   models.master_product_categories.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managepaymentstatus = async (req, res) => {
    const {id,name,isedit,isdelete,isActive} = req.body
    if(isedit)
    {
        await   models.payment_status_master.update(
            
            {name: name, 
                
                is_active: isActive,
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
            name: name, 
            is_active: isActive
           
            }
        await   models.payment_status_master.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.manageorderstatus = async (req, res) => {
    const {id,name,isedit,isdelete,isActive} = req.body
    if(isedit)
    {
        await   models.order_status_master.update(
            
            {name: name, 
                
                is_active: isActive,
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
            name: name, 
            is_active: isActive
           
            }
        await   models.order_status_master.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.manageseoattributes = async (req, res) => {
    const {id,name,attributeName,
        attributeValue,priority,seoText,seoUrl,
        isedit,isdelete,isActive} = req.body
    if(isedit)
    {
        await   models.seo_url_priorities.update(
            
            { 
                attribute_name: attributeName, 
                attribute_value: attributeValue,
                priority: priority,
                seo_text:seoText,
                seo_url:seoUrl,
                is_active: isActive
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
            attribute_name: attributeName, 
            attribute_value: attributeValue,
            priority: priority,
            seo_text:seoText,
            seo_url:seoUrl,
            is_active: isActive
            
           
            }
        await   models.seo_url_priorities.create(   
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
    const {id,name,isFilter,isActive,filterOrder,colorCode,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_gemstones_types.update(
            
            {   
                name: name,
                color_code:  colorCode,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            color_code: colorCode,
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
            }
        await   models.master_gemstones_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managegemshapes = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_gemstones_shapes.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder 
            }
        await   models.master_gemstones_shapes.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}
exports.managegemsettings = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_gemstones_settings.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder 
            }
        await   models.master_gemstones_settings.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.managediamondtypes = async (req, res) => {
    const {id,diamondClarity,diamondColor,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_diamond_types.update(
            
            {   
                diamond_clarity: diamondClarity,
                diamond_color : diamondColor,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            short_code : "",
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
            }
        await   models.master_diamond_types.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managediamondsettings = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_diamonds_settings.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder 
            }
        await   models.master_diamonds_settings.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managediamondshapes = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_diamonds_shapes.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder 
            }
        await   models.master_diamonds_shapes.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managedesigns = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_designs.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder 
            }
        await   models.master_designs.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}
exports.manageoccassions = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_occasions.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
               
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
            alias : name,
            is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
           
            }
        await   models.master_occasions.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managecollections = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_collections.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder 
            }
        await   models.master_collections.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managethemes = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_themes.update(
            
            {   
                name: name,
                is_filter : isFilter,
                is_active : isActive,
                filter_order: filterOrder
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
            alias : name,
            is_filter : isFilter,
                is_active : isActive,
                filter_order: filterOrder 
            }
        await   models.master_themes.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managestyles = async (req, res) => {
    const {id,name,isedit,isdelete,isFilter,isActive,filterOrder} = req.body
    if(isedit)
    {
        await   models.master_styles.update(
            
            {   
                name: name,
                is_filter : isFilter,
                is_active : isActive,
                filter_order: filterOrder
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
            alias : name,
            is_filter : isFilter,
            is_active : isActive,
            filter_order: filterOrder 
            }
        await   models.master_styles.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.managepurities = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_metals_purities.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active : isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active : isActive,
            filter_order : filterOrder 
            }
        await   models.master_metals_purities.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}


exports.managemetalcolors = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_metals_colors.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder 
            }
        await   models.master_metals_colors.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managematerials = async (req, res) => {
    const {id,name,filterOrder,isActive,isFilter,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_materials.update(
            
            {   
                name: name,
                filter_order : filterOrder,
                is_filter : isFilter,
                is_active : isActive

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
            filter_order : filterOrder,
                is_filter : isFilter,
                is_active : isActive
            }
        await   models.master_materials.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }
}

exports.manageearring = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_earring_backing.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder 
            }
        await   models.master_earring_backing.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managemasterattributes = async (req, res) => {
    const {id,name,isFilter,isSearch,filterPosition,isdelete,isedit} = req.body
    if(isedit)
    {
        await   models.Attribute_master.update(
            
            {   
                name: name,
                is_filter: isFilter,
                filter_position : filterPosition,
                is_search : isSearch
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
            name: name,
            is_filter: isFilter,
            filter_position : filterPosition,
            is_search : isSearch,
            is_active: true,
            short_code : "",
            }
        await   models.Attribute_master.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.managestones = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_stones.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder 
            }
        await   models.master_stones.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}
exports.managestonecolors = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_stones_colors.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder 
            }
        await   models.master_stones_colors.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}
exports.managestoneshapes = async (req, res) => {
    const {id,name,isFilter,isActive,filterOrder,isedit,isdelete} = req.body
    if(isedit)
    {
        await   models.master_stones_shapes.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder 
            }
        await   models.master_stones_shapes.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}

exports.manageweights = async (req, res) => {
    const {id,name,isedit,isFilter,isActive,filterOrder,isdelete} = req.body
    if(isedit)
    {
        await   models.master_weights.update(
            
            {   
                name: name,
                is_filter: isFilter,
                is_active: isActive,
                filter_order : filterOrder
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
            alias : name,
            is_filter: isFilter,
            is_active: isActive,
            filter_order : filterOrder 
            }
        await   models.master_weights.create(   
                     taxobj
                    )
        res.send(200,{"message":"Created Successfully"})
    }

}