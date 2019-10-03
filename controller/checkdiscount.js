
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const squelize= require('sequelize');
const uuidv1 = require('uuid/v1');
exports.checkdiscount = (req, res) => {
    var product_type = '';
    var product_occassions = [];
    var product_styles = [];
    var product_themes = [];

    models.product_lists.findOne({
      include: [{
        model: models.trans_sku_lists,
        where:{
          generated_sku: 'SR1313-14113400-10'
        }
       },
       {
        model: models.product_occassions,

       },{
        model: models.product_styles,

       },
       {
        model: models.product_themes,

       },
       {
        model: models.product_diamonds,

       },
       {
        model: models.product_gemstones,

       }
      
      ],
      where: {
        product_id: 'SR1313'
      }
    }).then(product=> {
     
      console.log("======>")

      product_type = product.product_type;
      product.product_occassions.forEach(function(element) {
        product_occassions.push(element.occassion_name);
      });
      product.product_styles.forEach(function(element) {
        product_styles.push(element.style_name);
      });
      product.product_themes.forEach(function(element) {
        product_themes.push(element.theme_name);
      });
      console.log(JSON.stringify(product_themes));
      console.log(JSON.stringify(product_occassions));
      console.log(JSON.stringify(product_styles));
      models.pricing_discount_setup.findAll({
        include:[
          {
           model : models.discount_styles_mapping
          },
          {
            model : models.discount_occassions_mapping
           },
           {
            model : models.discount_themes_mapping
           },
           {
            model : models.discount_product_type_mapping
           }

        ],
        where:{
          '$discount_product_type_mappings.product_type$':
          {
          [Op.eq]:product_type
          },
          '$discount_occassions_mappings.occassions$':
          {
          [Op.in]:product_occassions
          },
          '$discount_styles_mappings.styles$':
          {
          [Op.in]:product_styles
          },
          '$discount_themes_mappings.theme$':
          {
          [Op.in]:product_themes
          },
        }
      }).then(discount => {
        console.log(JSON.stringify(discount));
      })
    });



  
  
 
}