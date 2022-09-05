const models = require("./../models");
import "dotenv/config";
import moment from "moment";
var request = require("request");
const sequelize = require("sequelize");
const Op = require("sequelize").Op;
import apidata from "./apidata.json";
import { loadMasterAttributes } from "./filtercontroller";
const axios = require("axios");

const uuidv1 = require("uuid/v1");
exports.priceupdate = async (req, res) => {
  try {
    // request({
    //     url: 'http://localhost:8000/updatepricelist',
    //     method: "POST",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify({req_product_id : 'SR3261'})
    // }, function(error, response, body) {
    //    console.log(body)
    // });

    const _obj = {
      method: "post",
      url: process.env.apibaseurl + "/esearch_forceindex",
      data: {
        // product_id : 'SR3331'
      },
    };

    axios(_obj)
      .then(async (response) => {})
      .catch({});
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.ringpriceupdate = async (req, res) => {
  try {
    // const {skuprice} = req.body;
    let skus_arr = req.body;
    // console.log(JSON.stringify(req.body.length));
    processskuprice(0);
    async function processskuprice(indexval) {
      let processsku = skus_arr[indexval];
      await models.trans_sku_lists.update(
        { discount_price: processsku.discount_price },
        { where: { generated_sku: processsku.sku } }
      );
      indexval = indexval + 1;
      if (skus_arr.length > indexval) {
        processskuprice(indexval);
      } else {
        res.send(200, { message: "success" });
      }
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.updateproductattr = async (req, res) => {
  try {
    let products = await models.product_lists.findAll({
      where: {
        isactive: true,
        product_id: {
          [Op.notILike]: "%SR%",
        },
      },
    });
    var processcount = 0;
    res.send(200, { response: products.length });

    productupdate(processcount);
    async function productupdate(processcount) {
      let product_id = products[processcount].product_id;
      // console.log(product_id);
      var product_object = await models.product_lists.findOne({
        attributes: ["product_type", "product_category"],
        include: [
          {
            model: models.product_themes,
            attributes: ["theme_name"],
          },
          {
            model: models.product_styles,
            attributes: ["style_name"],
          },
          {
            model: models.product_occassions,
            attributes: ["occassion_name"],
          },
          {
            model: models.product_collections,
            attributes: ["collection_name"],
          },
          {
            model: models.product_materials,
            attributes: ["material_name"],
          },
          {
            model: models.product_diamonds,
            attributes: ["diamond_colour", "diamond_clarity"],
          },
          {
            model: models.product_purities,
            attributes: ["purity"],
          },
          {
            model: models.product_stonecount,
            attributes: ["stonecount"],
          },
          {
            model: models.product_stonecolor,
            attributes: ["stonecolor"],
          },
          {
            model: models.product_gender,
            attributes: ["gender_name"],
          },
        ],
        where: {
          product_id: product_id,
        },
      });
      let attributes_array = [];
      let product_category = await models.master_product_categories.findOne({
        where: {
          name: product_object.product_category,
        },
      });
      attributes_array.push(product_category.short_code);
      let product_type = await models.master_product_types.findOne({
        where: {
          name: product_object.product_type,
        },
      });
      attributes_array.push(product_type.alias);

      let materialname = [];
      product_object.product_materials.forEach((materialobj) => {
        materialname.push(materialobj.material_name);
      });
      let materials_arr = await models.master_materials.findAll({
        where: {
          name: {
            [Op.in]: materialname,
          },
        },
      });
      materials_arr.forEach((mat_obj) => {
        attributes_array.push(mat_obj.alias);
      });
      let collectionname = [];
      product_object.product_collections.forEach((collectionobj) => {
        collectionname.push(collectionobj.collection_name);
      });
      let collections_arr = await models.master_collections.findAll({
        where: {
          name: {
            [Op.in]: collectionname,
          },
        },
      });
      collections_arr.forEach((col_obj) => {
        attributes_array.push(col_obj.alias);
      });

      let purities = [];
      product_object.product_purities.forEach((purityobj) => {
        purities.push(purityobj.purity);
      });
      let purity_arr = await models.master_metals_purities.findAll({
        where: {
          name: {
            [Op.in]: purities,
          },
        },
      });
      purity_arr.forEach((purity_obj) => {
        attributes_array.push(purity_obj.alias);
      });

      let styles = [];
      product_object.product_styles.forEach((styleobj) => {
        styles.push(styleobj.style_name);
      });
      let style_arr = await models.master_styles.findAll({
        where: {
          name: {
            [Op.in]: styles,
          },
        },
      });
      style_arr.forEach((style_obj) => {
        attributes_array.push(style_obj.alias);
      });

      let occassions = [];
      product_object.product_occassions.forEach((ocassionobj) => {
        occassions.push(ocassionobj.occassion_name);
      });
      let occassion_arr = await models.master_occasions.findAll({
        where: {
          name: {
            [Op.in]: occassions,
          },
        },
      });

      occassion_arr.forEach((ocassion_obj) => {
        attributes_array.push(ocassion_obj.alias);
      });
      let diamonds_clarity_arr = [];
      let diamonds_color_arr = [];

      product_object.product_diamonds.forEach((diamond_obj) => {
        diamonds_clarity_arr.push(
          diamond_obj.diamond_clarity + diamond_obj.diamond_colour
        );
      });
      let master_diamonds = await models.master_diamond_types.findAll({});

      master_diamonds.forEach((diamond) => {
        let diamondname = diamond.diamond_color + diamond.diamond_clarity;

        if (diamonds_clarity_arr.indexOf(diamondname) > -1) {
          attributes_array.push(diamond.short_code);
        }
      });
      let updateobj = await models.product_lists.update(
        { attributes: attributes_array },
        {
          where: {
            product_id: product_id,
          },
        }
      );

      if (products.length > processcount) {
        processcount = processcount + 1;
        productupdate(processcount);
      } else {
        console.log("update complete");
      }
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.updateproductattr_bk = async (req, res) => {
  try {
    let products = await models.trans_sku_lists.findAll({
      attributes: ["product_id"],
      group: ["product_id"],
      where: {
        is_active: true,
        product_id: {
          [Op.iLike]: "%SR%",
        },
      },
    });
    var processcount = 0;

    res.send(200, { response: products.length });
    // console.log(products.length);
    productupdate(processcount);
    async function productupdate(processcount) {
      let product_id = products[processcount].product_id;
      // console.log(product_id);
      var product_object = await models.product_lists.findOne({
        attributes: ["product_type", "product_category"],
        include: [
          {
            model: models.trans_sku_lists,
            attributes: ["purity", "diamond_type", "generated_sku"],
          },
          {
            model: models.product_themes,
            attributes: ["theme_name"],
          },
          {
            model: models.product_styles,
            attributes: ["style_name"],
          },
          {
            model: models.product_occassions,
            attributes: ["occassion_name"],
          },
          {
            model: models.product_collections,
            attributes: ["collection_name"],
          },
          {
            model: models.product_materials,
            attributes: ["material_name"],
          },
          {
            model: models.product_purities,
            attributes: ["purity"],
          },
          {
            model: models.product_diamonds,
            attributes: ["diamond_colour", "diamond_clarity"],
          },
          {
            model: models.product_stonecount,
            attributes: ["stonecount"],
          },
          {
            model: models.product_stonecolor,
            attributes: ["stonecolor"],
          },
          {
            model: models.product_gender,
            attributes: ["gender_name"],
          },
        ],
        where: {
          product_id: product_id,
        },
      });

      let attributes_array = [];
      let purity_obj = {};
      let diamond_obj = {};
      let product_category = await models.master_product_categories.findOne({
        where: {
          name: product_object.product_category,
        },
      });
      attributes_array.push(product_category.short_code);
      let product_type = await models.master_product_types.findOne({
        where: {
          name: product_object.product_type,
        },
      });
      attributes_array.push(product_type.alias);

      let materialname = [];
      product_object.product_materials.forEach((materialobj) => {
        materialname.push(materialobj.material_name);
      });
      let materials_arr = await models.master_materials.findAll({
        where: {
          name: {
            [Op.in]: materialname,
          },
        },
      });
      materials_arr.forEach((mat_obj) => {
        attributes_array.push(mat_obj.alias);
      });
      let collectionname = [];
      product_object.product_collections.forEach((collectionobj) => {
        collectionname.push(collectionobj.collection_name);
      });
      let collections_arr = await models.master_collections.findAll({
        where: {
          name: {
            [Op.in]: collectionname,
          },
        },
      });
      collections_arr.forEach((col_obj) => {
        attributes_array.push(col_obj.alias);
      });

      let purities = [];
      product_object.product_purities.forEach((purityobj) => {
        purities.push(purityobj.purity);
      });
      let purity_arr = await models.master_metals_purities.findAll({
        where: {
          name: {
            [Op.in]: purities,
          },
        },
      });

      let diamonds_clarity_arr = [];
      let diamonds_color_arr = [];

      product_object.product_diamonds.forEach((diamond_obj) => {
        diamonds_clarity_arr.push(diamond_obj.diamond_clarity);
        diamonds_color_arr.push(diamond_obj.diamond_colour);
      });
      let master_diamonds = await models.master_diamond_types.findAll({
        where: {
          diamond_color: {
            [Op.in]: diamonds_clarity_arr,
          },
          diamond_clarity: {
            [Op.in]: diamonds_color_arr,
          },
        },
      });
      // console.log(JSON.stringify(diamonds_clarity_arr));
      // console.log(JSON.stringify(diamonds_color_arr));

      master_diamonds.forEach((diamond) => {
        let diamond_val = diamond.diamond_color + diamond.diamond_clarity;
        let diamond_shortcode = diamond.short_code;
        diamond_obj[diamond_val] = diamond_shortcode;
      });
      // console.log(JSON.stringify(diamond_obj));
      purity_arr.forEach((purityobj) => {
        // attributes_array.push(purity_obj.alias)
        purity_obj[purityobj.name] = purityobj.alias;
      });

      let styles = [];
      product_object.product_styles.forEach((styleobj) => {
        styles.push(styleobj.style_name);
      });
      let style_arr = await models.master_styles.findAll({
        where: {
          name: {
            [Op.in]: styles,
          },
        },
      });
      style_arr.forEach((style_obj) => {
        attributes_array.push(style_obj.alias);
      });

      let occassions = [];
      product_object.product_occassions.forEach((ocassionobj) => {
        occassions.push(ocassionobj.occassion_name);
      });
      let occassion_arr = await models.master_occasions.findAll({
        where: {
          name: {
            [Op.in]: occassions,
          },
        },
      });
      occassion_arr.forEach((ocassion_obj) => {
        attributes_array.push(ocassion_obj.alias);
      });
      let updateobj = await models.product_lists.update(
        { attributes: attributes_array },
        {
          where: {
            product_id: product_id,
          },
        }
      );
      processsku(0);
      async function processsku(skucount) {
        if (product_object.trans_sku_lists.length > skucount) {
          let skuobj = product_object.trans_sku_lists[skucount];
          let sku_atter = [];
          attributes_array.forEach((attr) => {
            sku_atter.push(attr);
          });
          sku_atter.push(diamond_obj[skuobj.diamond_type]);
          sku_atter.push(purity_obj[skuobj.purity]);

          await models.trans_sku_lists.update(
            {
              attributes: sku_atter,
            },
            {
              where: {
                generated_sku: skuobj.generated_sku,
              },
            }
          );
          skucount = skucount + 1;
          processsku(skucount);
        } else {
          if (products.length > processcount) {
            let prod_uuid = products[processcount].product_id;
            processcount = processcount + 1;
            updatediscountsku(product_object);
            productupdate(prod_uuid);
          } else {
            console.log("update complete");
          }
        }
      }
      // product_object.trans_sku_lists.forEach(async skuobj => {
      //     let sku_atter = []
      //     sku_atter = attributes_array
      //     console.log(skuobj.generated_sku)

      //      sku_atter.push(purity_obj[skuobj.purity])

      //      await models.trans_sku_lists.update(
      //          {
      //              "attributes" : sku_atter
      //          },
      //          {
      //              where:{
      //                  generated_sku : skuobj.generated_sku
      //              }
      //          }
      //      )
      //     // res.send(200,{"response":sku_atter})

      // })
      // let updateobj = await models.product_lists.update(
      //     {"attributes": attributes_array},
      //     {
      //     where:{
      //         product_id : product_id
      //     }
      // }

      // )
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.updateproductattribute = async (req, res) => {
  try {
    const { product_id } = req.body;
    let products = await models.trans_sku_lists.findAll({
      attributes: ["product_id"],
      group: ["product_id"],
      where: {
        product_id: product_id,
      },
    });
    var processcount = 0;

    res.send(200, { response: products.length });
    // console.log(products.length);
    productupdate(processcount);
    async function productupdate(processcount) {
      let product_id = products[processcount].product_id;
      // console.log(product_id);
      var product_object = await models.product_lists.findOne({
        attributes: ["product_type", "product_category"],
        include: [
          {
            model: models.trans_sku_lists,
            attributes: ["purity", "diamond_type", "generated_sku"],
          },
          {
            model: models.product_themes,
            attributes: ["theme_name"],
          },
          {
            model: models.product_styles,
            attributes: ["style_name"],
          },
          {
            model: models.product_occassions,
            attributes: ["occassion_name"],
          },
          {
            model: models.product_collections,
            attributes: ["collection_name"],
          },
          {
            model: models.product_materials,
            attributes: ["material_name"],
          },
          {
            model: models.product_purities,
            attributes: ["purity"],
          },
          {
            model: models.product_diamonds,
            attributes: ["diamond_colour", "diamond_clarity"],
          },
          {
            model: models.product_stonecount,
            attributes: ["stonecount"],
          },
          {
            model: models.product_stonecolor,
            attributes: ["stonecolor"],
          },
          {
            model: models.product_gender,
            attributes: ["gender_name"],
          },
        ],
        where: {
          product_id: product_id,
        },
      });

      let attributes_array = [];
      let purity_obj = {};
      let diamond_obj = {};
      let product_category = await models.master_product_categories.findOne({
        where: {
          name: product_object.product_category,
        },
      });
      attributes_array.push(product_category.alias);
      let product_type = await models.master_product_types.findOne({
        where: {
          name: product_object.product_type,
        },
      });
      attributes_array.push(product_type.alias);

      let materialname = [];
      product_object.product_materials.forEach((materialobj) => {
        materialname.push(materialobj.material_name);
      });
      let materials_arr = await models.master_materials.findAll({
        where: {
          name: {
            [Op.in]: materialname,
          },
        },
      });
      materials_arr.forEach((mat_obj) => {
        attributes_array.push(mat_obj.alias);
      });
      let collectionname = [];
      product_object.product_collections.forEach((collectionobj) => {
        collectionname.push(collectionobj.collection_name);
      });
      let collections_arr = await models.master_collections.findAll({
        where: {
          name: {
            [Op.in]: collectionname,
          },
        },
      });
      collections_arr.forEach((col_obj) => {
        attributes_array.push(col_obj.alias);
      });

      let purities = [];
      product_object.product_purities.forEach((purityobj) => {
        purities.push(purityobj.purity);
      });
      let purity_arr = await models.master_metals_purities.findAll({
        where: {
          name: {
            [Op.in]: purities,
          },
        },
      });

      let diamonds_clarity_arr = [];
      let diamonds_color_arr = [];

      product_object.product_diamonds.forEach((diamond_obj) => {
        diamonds_clarity_arr.push(diamond_obj.diamond_clarity);
        diamonds_color_arr.push(diamond_obj.diamond_colour);
      });
      let master_diamonds = await models.master_diamond_types.findAll({
        where: {
          diamond_color: {
            [Op.in]: diamonds_clarity_arr,
          },
          diamond_clarity: {
            [Op.in]: diamonds_color_arr,
          },
        },
      });
      // console.log(JSON.stringify(diamonds_clarity_arr));
      // console.log(JSON.stringify(diamonds_color_arr));

      master_diamonds.forEach((diamond) => {
        let diamond_val = diamond.diamond_color + diamond.diamond_clarity;
        let diamond_shortcode = diamond.short_code;
        diamond_obj[diamond_val] = diamond_shortcode;
      });
      purity_arr.forEach((purityobj) => {
        // console.log("***********");
        // console.log(JSON.stringify(purityobj));

        // console.log("***********");

        attributes_array.push(purityobj.alias);
        purity_obj[purityobj.name] = purityobj.alias;
      });

      let styles = [];
      product_object.product_styles.forEach((styleobj) => {
        styles.push(styleobj.style_name);
      });
      let style_arr = await models.master_styles.findAll({
        where: {
          name: {
            [Op.in]: styles,
          },
        },
      });
      style_arr.forEach((style_obj) => {
        attributes_array.push(style_obj.alias);
      });

      let occassions = [];
      product_object.product_occassions.forEach((ocassionobj) => {
        occassions.push(ocassionobj.occassion_name);
      });
      let occassion_arr = await models.master_occasions.findAll({
        where: {
          name: {
            [Op.in]: occassions,
          },
        },
      });
      occassion_arr.forEach((ocassion_obj) => {
        attributes_array.push(ocassion_obj.alias);
      });
      let updateobj = await models.product_lists.update(
        { attributes: attributes_array },
        {
          where: {
            product_id: product_id,
          },
        }
      );
      processsku(0);
      async function processsku(skucount) {
        if (product_object.trans_sku_lists.length > skucount) {
          let skuobj = product_object.trans_sku_lists[skucount];
          let sku_atter = [];
          attributes_array.forEach((attr) => {
            sku_atter.push(attr);
          });
          sku_atter.push(diamond_obj[skuobj.diamond_type]);
          sku_atter.push(purity_obj[skuobj.purity]);
          // console.log("=====CCCCCC=====");
          // console.log(skuobj.purity);
          // console.log(purity_obj[skuobj.purity]);
          // console.log("=====CCCCCC=====");
          await models.trans_sku_lists.update(
            {
              attributes: sku_atter,
            },
            {
              where: {
                generated_sku: skuobj.generated_sku,
              },
            }
          );
          skucount = skucount + 1;
          processsku(skucount);
        } else {
          if (processcount > products.length) {
            processcount = processcount + 1;
            productupdate(processcount);
          } else {
            // console.log("update complete");
            updatediscountsku([attributes_array[0]], product_id);
          }
        }
      }
      // product_object.trans_sku_lists.forEach(async skuobj => {
      //     let sku_atter = []
      //     sku_atter = attributes_array
      //     console.log(skuobj.generated_sku)

      //      sku_atter.push(purity_obj[skuobj.purity])

      //      await models.trans_sku_lists.update(
      //          {
      //              "attributes" : sku_atter
      //          },
      //          {
      //              where:{
      //                  generated_sku : skuobj.generated_sku
      //              }
      //          }
      //      )
      //     // res.send(200,{"response":sku_atter})

      // })
      // let updateobj = await models.product_lists.update(
      //     {"attributes": attributes_array},
      //     {
      //     where:{
      //         product_id : product_id
      //     }
      // }

      // )
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
async function updateexistingdiscount() {
  try {
    let discounts = await models.sale_discount.findAll({});
    let processcount = 0;
    updatediscountattr(processcount);
    async function updatediscountattr(processcount) {
      let discountobj = discounts[processcount];
      let attributesarr = [];
      if (discountobj.product_attributes) {
        let attr_obj = discountobj.product_attributes;
        let attr_keys = Object.keys(discountobj.product_attributes);

        attr_keys.forEach((element_key) => {
          let attr_val = attr_obj[element_key];
          if (attr_val.alias) {
            let alias_obj = attr_val.alias;
            alias_obj.forEach((aliasval) => {
              attributesarr.push(aliasval);
            });
          }
        });
      }

      // console.log(JSON.stringify(attributesarr));

      await models.sale_discount.update(
        // Values to update
        {
          attributes: attributesarr,
        },
        {
          // Clause
          where: {
            id: discountobj.id,
          },
        }
      );
      processcount++;
      if (discounts.length > processcount) {
        updatediscountattr(processcount);
      }
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
}
async function addproductattributes(category_alias, product_id) {
  try {
    // console.log("XX++X+X+X+X+X+X");
    // console.log(category_alias);
    // console.log(product_id);
    // console.log("XX++X+X+X+X+X+X");
    let products = await models.trans_sku_lists.findAll({
      attributes: ["product_id"],
      group: ["product_id"],
      where: {
        product_id: product_id,
      },
    });
    var processcount = 0;

    // console.log(products.length);
    productupdate(processcount);
    async function productupdate(processcount) {
      let product_id = products[processcount].product_id;
      // console.log(product_id);
      var product_object = await models.product_lists.findOne({
        attributes: ["product_type", "product_category"],
        include: [
          {
            model: models.trans_sku_lists,
            attributes: ["purity", "diamond_type", "generated_sku"],
          },
          {
            model: models.product_themes,
            attributes: ["theme_name"],
          },
          {
            model: models.product_styles,
            attributes: ["style_name"],
          },
          {
            model: models.product_occassions,
            attributes: ["occassion_name"],
          },
          {
            model: models.product_collections,
            attributes: ["collection_name"],
          },
          {
            model: models.product_materials,
            attributes: ["material_name"],
          },
          {
            model: models.product_purities,
            attributes: ["purity"],
          },
          {
            model: models.product_diamonds,
            attributes: ["diamond_colour", "diamond_clarity"],
          },
          {
            model: models.product_stonecount,
            attributes: ["stonecount"],
          },
          {
            model: models.product_stonecolor,
            attributes: ["stonecolor"],
          },
          {
            model: models.product_gender,
            attributes: ["gender_name"],
          },
        ],
        where: {
          product_id: product_id,
        },
      });

      let attributes_array = [];
      let purity_obj = {};
      let diamond_obj = {};
      let product_category = await models.master_product_categories.findOne({
        where: {
          name: product_object.product_category,
        },
      });
      attributes_array.push(product_category.alias);
      let product_type = await models.master_product_types.findOne({
        where: {
          name: product_object.product_type,
        },
      });
      attributes_array.push(product_type.alias);

      let materialname = [];
      product_object.product_materials.forEach((materialobj) => {
        materialname.push(materialobj.material_name);
      });
      let materials_arr = await models.master_materials.findAll({
        where: {
          name: {
            [Op.in]: materialname,
          },
        },
      });
      materials_arr.forEach((mat_obj) => {
        attributes_array.push(mat_obj.alias);
      });
      let collectionname = [];
      product_object.product_collections.forEach((collectionobj) => {
        collectionname.push(collectionobj.collection_name);
      });
      let collections_arr = await models.master_collections.findAll({
        where: {
          name: {
            [Op.in]: collectionname,
          },
        },
      });
      collections_arr.forEach((col_obj) => {
        attributes_array.push(col_obj.alias);
      });

      let purities = [];
      product_object.product_purities.forEach((purityobj) => {
        purities.push(purityobj.purity);
      });
      let purity_arr = await models.master_metals_purities.findAll({
        where: {
          name: {
            [Op.in]: purities,
          },
        },
      });

      let diamonds_clarity_arr = [];
      let diamonds_color_arr = [];

      product_object.product_diamonds.forEach((diamond_obj) => {
        diamonds_clarity_arr.push(diamond_obj.diamond_clarity);
        diamonds_color_arr.push(diamond_obj.diamond_colour);
      });
      let master_diamonds = await models.master_diamond_types.findAll({
        where: {
          diamond_color: {
            [Op.in]: diamonds_clarity_arr,
          },
          diamond_clarity: {
            [Op.in]: diamonds_color_arr,
          },
        },
      });
      // console.log(JSON.stringify(diamonds_clarity_arr));
      // console.log(JSON.stringify(diamonds_color_arr));

      master_diamonds.forEach((diamond) => {
        let diamond_val = diamond.diamond_color + diamond.diamond_clarity;
        let diamond_shortcode = diamond.short_code;
        diamond_obj[diamond_val] = diamond_shortcode;
      });
      // console.log(JSON.stringify(diamond_obj));
      purity_arr.forEach((purityobj) => {
        // attributes_array.push(purity_obj.alias)
        purity_obj[purityobj.name] = purityobj.alias;
      });

      let styles = [];
      product_object.product_styles.forEach((styleobj) => {
        styles.push(styleobj.style_name);
      });
      let style_arr = await models.master_styles.findAll({
        where: {
          name: {
            [Op.in]: styles,
          },
        },
      });
      style_arr.forEach((style_obj) => {
        attributes_array.push(style_obj.alias);
      });

      let occassions = [];
      product_object.product_occassions.forEach((ocassionobj) => {
        occassions.push(ocassionobj.occassion_name);
      });
      let occassion_arr = await models.master_occasions.findAll({
        where: {
          name: {
            [Op.in]: occassions,
          },
        },
      });
      occassion_arr.forEach((ocassion_obj) => {
        attributes_array.push(ocassion_obj.alias);
      });
      let updateobj = await models.product_lists.update(
        { attributes: attributes_array },
        {
          where: {
            product_id: product_id,
          },
        }
      );
      processsku(0);
      async function processsku(skucount) {
        if (product_object.trans_sku_lists.length > skucount) {
          let skuobj = product_object.trans_sku_lists[skucount];
          let sku_atter = [];
          attributes_array.forEach((attr) => {
            sku_atter.push(attr);
          });
          sku_atter.push(diamond_obj[skuobj.diamond_type]);
          sku_atter.push(purity_obj[skuobj.purity]);

          await models.trans_sku_lists.update(
            {
              attributes: sku_atter,
            },
            {
              where: {
                generated_sku: skuobj.generated_sku,
              },
            }
          );
          skucount = skucount + 1;
          processsku(skucount);
        } else {
          processcount = processcount + 1;

          if (products.length > processcount) {
            productupdate(processcount);
          } else {
            updatediscountsku([category_alias], product_id);
          }
        }
      }
      // product_object.trans_sku_lists.forEach(async skuobj => {
      //     let sku_atter = []
      //     sku_atter = attributes_array
      //     console.log(skuobj.generated_sku)

      //      sku_atter.push(purity_obj[skuobj.purity])

      //      await models.trans_sku_lists.update(
      //          {
      //              "attributes" : sku_atter
      //          },
      //          {
      //              where:{
      //                  generated_sku : skuobj.generated_sku
      //              }
      //          }
      //      )
      //     // res.send(200,{"response":sku_atter})

      // })
      // let updateobj = await models.product_lists.update(
      //     {"attributes": attributes_array},
      //     {
      //     where:{
      //         product_id : product_id
      //     }
      // }

      // )
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
}
exports.productattributes = async (req, res) => {
  updatediscountsku(["CAT001"], "SE3426", res);
  //updateexistingdiscount();
};
async function updatediscountsku(category_arr, product_id, res) {
  try {
    let shoppingcart1 = await models.sale_discount.findAll({
      attributes: ["id", "product_attributes", "product_ids"],
      where: {
        is_active: true,
        attributes: {
          [Op.contains]: category_arr,
        },
      },
    });
    if (shoppingcart1) {
      shoppingcart1.forEach(async (attr_obj) => {
        let attr_arr = [];
        let skus_arr = [];
        let sku_content = [];
        let attr_content = attr_obj.product_attributes;
        let attr_keys = Object.keys(attr_obj.product_attributes);

        attr_keys.forEach((element_key) => {
          let element_value = attr_content[element_key].alias;

          if (Array.isArray(element_value)) {
            let attr_where = {
              attributes: {
                [Op.overlap]: element_value,
              },
            };
            attr_arr.push(element_value);
            skus_arr.push(attr_where);
          }
        });
        if (skus_arr.length > 0) {
          let attrobj = {
            [Op.or]: skus_arr,
          };
          sku_content.push(attrobj);
        }

        let product_id_where = {
          product_id: product_id,
        };
        sku_content.push(product_id_where);
        let shoppingcart = await models.trans_sku_lists.findAll({
          where: {
            product_id: product_id,
            [Op.and]: skus_arr,
          },
        });
        if (shoppingcart) {
          // console.log("=======");
          // console.log(shoppingcart.length);
          // console.log("========");
        }
        let trans_sku_array = attr_obj.product_ids ? attr_obj.product_ids : [];
        shoppingcart.forEach((sku_obj) => {
          trans_sku_array.push(sku_obj.generated_sku);
        });

        await models.sale_discount.update(
          // Values to update
          {
            product_ids: trans_sku_array,
          },
          {
            // Clause
            where: {
              id: attr_obj.id,
            },
          }
        );
        //res.send(409,{status: "200",message: shoppingcart})
      });
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
}
exports.productupload = async (req, res) => {
  try {
    var apidata = req.body;
    var product_skus = [];
    var skuurl = "";
    // console.log(JSON.stringify(apidata));
    var categoryobj = apidata.product_categoy;
    var categoryval = categoryobj.charAt(0);
    var producttypeobj = apidata.product_type;
    var producttypeval = producttypeobj.shortCode;
    var seriesvalue = apidata.startcode + 1;
    // console.log("i am here");
    // console.log(seriesvalue);
    skuurl = categoryobj;
    if (Number.isNaN(seriesvalue)) {
      // console.log("i am here");
      seriesvalue = 3000;
    }
    if (categoryobj !== producttypeobj.name) {
      skuurl = skuurl + "/" + producttypeobj.name;
    }
    let lastsku = await models.trans_sku_lists.findOne({
      attributes: ["sku_id"],
      where: {
        is_active: true,
      },
      order: [
        //  [ sequelize.cast(sequelize.col('sku_id'), 'BIGINT') , 'ASC' ]
        [sequelize.cast(sequelize.col("sku_id"), "BIGINT"), "DESC"],
      ],
    });
    var lastsku_id = parseInt(lastsku.sku_id);

    let final_series = await models.product_lists.findOne({
      order: [["product_series", "DESC"]],
      attributes: ["product_series"],
    });
    var product_series = 3001;
    if (final_series) {
      product_series = final_series.product_series + 1;
    }
    var product_id = "S" + producttypeval + product_series;

    var skuprefix = "S" + producttypeval + product_series + "-";

    var product_name = apidata.productname;
    var product_category = apidata.product_categoy;
    var product_type = apidata.product_type.name;
    var gender = apidata.selectedgender;
    var vendorname = apidata.vendorcode.name;
    var vendor_code = apidata.vendorcode.shortCode;
    var product_series = product_series;
    var height = apidata.metal_height;
    var width = apidata.metal_width;
    var length = apidata.metal_length;
    var productsizes = apidata.selected_sizes;
    var productcolors = apidata.metalcolour;
    var productpurity = apidata.metalpurity;
    var isreorderable = apidata.isreorderable;
    var product_vendor_code = apidata.productvendorcode;
    var default_size = apidata.default_size;
    var default_metal_color = apidata.default_metal_colour;
    var default_metal_purity = apidata.default_metal_purity;
    var materials = apidata.material_names;
    var default_metal_size = apidata.default_size;
    var stonecolour_lists = apidata.stonecolour;
    var stonecount_lists = apidata.stonecount;
    var vendorleadtime = apidata.vendorleadtime;

    var product_images = apidata.product_images;
    var size_varient = "";

    if (productsizes) {
      size_varient = productsizes.join(",");
    }

    var default_weight = apidata[default_metal_purity + "_metal_weight"];

    var isreorderable = false;
    if (apidata.isreorderable === "Yes") {
      isreorderable = true;
    }
    var colour_varient = "";
    var diamondlist = [];
    var gemstonelist = [];
    var product_collections = apidata.collections;
    var product_occassions = apidata.occassions;
    var product_themes = apidata.themes;
    var product_styles = apidata.prod_styles;

    var metals = apidata.metals;

    metals.forEach((element) => {
      if (element.metalname === "Diamond") {
        diamondlist.push(element);
      }
      if (element.metalname === "Gemstone") {
        gemstonelist.push(element);
      }
    });

    if (productcolors && productpurity) {
      var colorarr = [];
      productpurity.forEach((purityelement) => {
        productcolors.forEach((colorelement) => {
          colorarr.push(purityelement.name + " " + colorelement.name);
        });
      });
      colour_varient = colorarr.join(",");
    }

    var product_obj = {
      id: uuidv1(),
      product_id,
      product_series,
      vendor_code,
      product_name,
      product_category,
      isactive: false,
      default_weight,
      gender,
      height,
      width,
      length,
      product_type,
      product_vendor_code,
      default_size,
      size_varient,
      colour_varient,
      isreorderable,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let sku_url =
      product_obj.product_category.toLowerCase() +
      "/" +
      product_obj.product_type.toLowerCase() +
      "/" +
      product_obj.product_name.replace(" ", "-") +
      "?sku_id=";

    let successmessage = await models.master_product_categories.create(
      product_obj
    );
    let product_category_obj = await models.master_product_categories.findOne({
      name: product_obj.product_category,
    });

    /*************** images list ********************/
    var prod_images = [];
    if (Object.keys(product_images)) {
      Object.keys(product_images).forEach((key) => {
        let images_arr = product_images[key];
        var imgposition = 0;
        images_arr.forEach((element) => {
          let ishover = false;
          let isdefault = false;
          imgposition = imgposition + 1;
          if (imgposition == 2) {
            ishover = true;
          }
          if (element.position == 1) {
            isdefault = true;
          }
          var image_obj = {
            id: uuidv1(),
            product_id: successmessage.product_id,
            product_color: element.color,
            image_url: element.image_url,
            image_position: imgposition,
            ishover,
            isdefault: default_metal_color === element.color ? true : false,
          };
          prod_images.push(image_obj);
        });
      });
      // console.log(JSON.stringify(prod_images));
      await models.product_images.bulkCreate(prod_images, {
        individualHooks: true,
      });
    }
    /*************** add gender ********************/
    if (gender) {
      const genderobj = {
        id: uuidv1(),
        gender_name: gender,
        product_id: product_obj.product_id,
        is_active: true,
      };
      await models.product_gender.create(genderobj);
    }

    /*************** purity list ********************/
    var puritylist = apidata.metalpurity;
    var purityarr = [];
    puritylist.forEach((purity) => {
      const purityobj = {
        id: uuidv1(),
        purity: purity.name,
        product_id: product_obj.product_id,
        is_active: true,
      };
      purityarr.push(purityobj);
      var sku = skuprefix + purity.shortCode;
      var skuobj = {
        product_id: successmessage.product_id,
        product_type: producttypeval,
        service_name: vendorname,
        product_series: seriesvalue,
        purity: purity.name,
        generated_sku: sku,
      };
      product_skus.push(skuobj);
    });
    if (puritylist) {
      await models.product_purities.bulkCreate(purityarr, {
        individualHooks: true,
      });
    }
    // console.log("puritylistcount");
    // console.log(product_skus.length);
    /************ product stone colour */
    var stonecolourarr = [];

    if (stonecolour_lists) {
      stonecolour_lists.forEach((stonecolourobj) => {
        const stone_colour_obj = {
          id: uuidv1(),
          stonecolor: stonecolourobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        stonecolourarr.push(stone_colour_obj);
      });

      await models.product_stonecolor.bulkCreate(stonecolourarr, {
        individualHooks: true,
      });
    }
    /******************************** */

    /************ product stone count */
    var stonecountsarr = [];

    if (stonecount_lists) {
      stonecount_lists.forEach((stonecountobj) => {
        const stone_count_obj = {
          id: uuidv1(),
          stonecount: stonecountobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        stonecountsarr.push(stone_count_obj);
      });

      await models.product_stonecount.bulkCreate(stonecountsarr, {
        individualHooks: true,
      });
    }
    /******************************** */

    var collection_arr = [];
    if (product_collections) {
      product_collections.forEach((collectonobj) => {
        const collection = {
          id: uuidv1(),
          collection_name: collectonobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        collection_arr.push(collection);
      });

      await models.product_collections.bulkCreate(collection_arr, {
        individualHooks: true,
      });
    }

    var occassions_arr = [];
    if (product_occassions) {
      product_occassions.forEach((occassionsobj) => {
        const occassion = {
          id: uuidv1(),
          occassion_name: occassionsobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        occassions_arr.push(occassion);
      });
      await models.product_occassions.bulkCreate(occassions_arr, {
        individualHooks: true,
      });
    }

    var styles_arr = [];
    if (product_styles) {
      product_styles.forEach((styleobj) => {
        const style = {
          id: uuidv1(),
          style_name: styleobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        styles_arr.push(style);
      });
      await models.product_styles.bulkCreate(styles_arr, {
        individualHooks: true,
      });
    }

    var themes_arr = [];
    if (product_themes) {
      product_themes.forEach((themeobj) => {
        const style = {
          id: uuidv1(),
          theme_name: themeobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        themes_arr.push(style);
      });
      await models.product_themes.bulkCreate(themes_arr, {
        individualHooks: true,
      });
    }

    var material_arr = [];
    if (materials) {
      materials.forEach((materialobj) => {
        const metal_obj = {
          id: uuidv1(),
          material_name: materialobj,
          product_sku: product_obj.product_id,
          is_active: true,
        };
        material_arr.push(metal_obj);
      });
      await models.product_materials.bulkCreate(material_arr, {
        individualHooks: true,
      });

      if (materials.indexOf("Diamond") > -1) {
        skuurl = skuurl + "/" + "Diamond";
      } else if (materials.indexOf("Gemstone") > -1) {
        skuurl = skuurl + "/" + "Gemstone";
      } else {
        skuurl = skuurl + "/" + materials[0];
      }
    }

    var skus = product_skus;

    product_skus = [];
    var metalcolorlist = apidata.metalcolour;

    /*************** add metalcolor ********************/

    var metal_color_arr = [];
    if (metalcolorlist) {
      metalcolorlist.forEach((metalcolorobj) => {
        const colorobj = {
          id: uuidv1(),
          product_color: metalcolorobj.name,
          product_id: product_obj.product_id,
          is_active: true,
        };
        metal_color_arr.push(colorobj);
      });
      await models.product_metalcolours.bulkCreate(metal_color_arr, {
        individualHooks: true,
      });
    }
    /****************** */

    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;

      metalcolorlist.forEach((metalcolor) => {
        var sku = skuval + metalcolor.shortCode;

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          metal_color: metalcolor.name,
        };
        product_skus.push(skuobj);
      });
    });
    // console.log("metalcolorlistcount");
    // console.log(product_skus.length);

    /*************** Diamond Lists ********************/
    var skus = product_skus;

    product_skus = [];
    var diamond_sku_clarity = {};
    let diamondtype = await models.master_diamond_types.findAll({});
    diamondtype.forEach((diamond_type) => {
      var claritytype =
        diamond_type.diamond_color + diamond_type.diamond_clarity;
      diamond_sku_clarity[claritytype] = diamond_type.short_code;
    });
    var diamondsarr = [];
    diamondlist.forEach((diamond) => {
      var clarity = diamond.clarity.name + diamond.color.shortCode;

      const diamonval = {
        id: uuidv1(),
        diamond_colour: diamond.color.shortCode,
        diamond_clarity: diamond.clarity.name,
        diamond_settings: diamond.settings.name,
        diamond_shape: diamond.shape.name,
        stone_count: diamond.count,
        diamond_type: clarity,
        stone_weight: diamond.weight,
        product_sku: product_obj.product_id,
      };
      diamondsarr.push(diamonval);
    });
    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;

      diamondlist.forEach((diamond) => {
        var clarity = diamond.clarity.name + diamond.color.shortCode;

        var sku = skuval + diamond_sku_clarity[clarity];

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          diamond_color: diamond.color.shortCode,
          diamond_type: clarity,
        };
        product_skus.push(skuobj);
      });
    });
    if (product_skus.length == 0) {
      product_skus = skus;
    }
    await models.product_diamonds.bulkCreate(diamondsarr, {
      individualHooks: true,
    });
    // console.log("diamndlistcount");
    // console.log(product_skus.length);

    /*************** gemstone Lists ********************/

    skus = product_skus;
    var gemstonearr = [];
    var gemstonesku = "";
    var gemstonecolorcode1 = "00";
    var gemstonecolorcode2 = "00";
    var gemstoneshortcode = "00";
    var gemstonecolorcode2 = "00";
    gemstonelist.forEach((gem) => {
      const gemstone_obj = {
        id: uuidv1(),
        gemstone_type: gem.clarity.name,
        gemstone_shape: gem.color.name,
        gemstone_setting: gem.settings.name,
        gemstone_size: gem.shape,
        stone_count: gem.count,
        stone_weight: gem.weight,
        product_sku: product_obj.product_id,
      };

      gemstonearr.push(gemstone_obj);
    });

    await models.product_gemstones.bulkCreate(gemstonearr, {
      individualHooks: true,
    });
    if (gemstonelist.length > 0) {
      var firstgemobj = gemstonelist[0];
      gemstoneshortcode = firstgemobj.clarity.shortCode;
      gemstonesku = firstgemobj.clarity.colorCode;
      gemstonecolorcode1 = firstgemobj.clarity.colorCode;
    }
    if (gemstonelist.length > 1) {
      var secondgemobj = gemstonelist[1];

      gemstonesku = gemstonesku + secondgemobj.clarity.colorCode;
      gemstonecolorcode2 = secondgemobj.clarity.colorCode;
    }

    product_skus = [];
    skus.forEach((skuvalue) => {
      var sku =
        skuvalue.generated_sku + gemstonecolorcode1 + gemstonecolorcode2;

      var skuobj = {
        ...skuvalue,
        generated_sku: sku,
      };
      product_skus.push(skuobj);

      // product_skus.push(sku)
    });
    // console.log("gemslistcount");
    // console.log(product_skus.length);
    if (product_skus.length == 0) {
      product_skus = skus;
    }
    /*************** Size Lists ********************/

    skus = product_skus;
    product_skus = [];
    var sizelist = apidata.selected_sizes;
    // console.log(sizelist.length);
    skus.forEach((skuvalue) => {
      sizelist.forEach((sizevalue) => {
        var sku = skuvalue.generated_sku + "_" + sizevalue;

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          sku_size: sizevalue,
        };
        product_skus.push(skuobj);
      });
    });
    if (product_skus.length == 0) {
      product_skus = skus;
    }
    // console.log("size" + product_skus.length);
    // console.log("sizelistcount");
    // console.log(product_skus.length);

    var uploadskus = [];
    var uploaddescriptions = [];
    product_skus.forEach((prodkt) => {
      var isdefault = false;
      var keyvalue = prodkt.purity + "_metal_weight";
      // console.log("productweight");
      // console.log(keyvalue);

      var sku_weight = apidata[keyvalue];
      // console.log(sku_weight);

      if (
        prodkt.metal_color === default_metal_color &&
        prodkt.purity === default_metal_purity &&
        prodkt.sku_size === default_metal_size
      ) {
        isdefault = true;
      }

      if (
        apidata.product_type.shortCode.toLowerCase() === "r" ||
        apidata.product_type.shortCode.toLowerCase() == "b"
      ) {
        const sizedifferent =
          parseFloat(prodkt.sku_size) - parseFloat(default_metal_size);
        // console.log(">sizedifference" + sizedifferent);
        // console.log(">sku_weight" + parseFloat(sku_weight));

        sku_weight =
          parseFloat(sku_weight) + Math.round(sizedifferent * 0.1 * 100) / 100;
        sku_weight = Math.round(sku_weight * 100) / 100;
      } else {
        sku_weight = Math.round(parseFloat(sku_weight) * 100) / 100;
      }
      lastsku_id = lastsku_id + 1;
      let sku_urlval = sku_url + lastsku_id;
      var sku_description =
        product_obj.product_type +
        "set in " +
        prodkt.purity +
        " " +
        prodkt.metal_color;
      if (materials.length > 0) {
        sku_description =
          sku_description + " " + materials[0] + " " + sku_weight + " gm";
      }
      if (diamondlist.length > 0) {
        sku_description = sku_description + "with Diamonds (";
        diamondlist.forEach((diamondobj) => {
          var clarity = diamondobj.clarity.name + diamondobj.color.shortCode;
          var diamondweight = diamondobj.weight;
          sku_description = sku_description + diamondweight + "ct " + clarity;
        });
        sku_description = sku_description + " )";
      }
      if (gemstonelist.length > 0) {
        if (diamondlist.length == 0) {
          sku_description = sku_description + "with Gemstones (";
        }
        gemstonelist.forEach((gem) => {
          var gemname = gem.clarity.name;
          sku_description = sku_description + " " + gemname;
        });

        sku_description = sku_description + " )";
      }
      const sku_desc = {
        id: uuidv1(),
        sku_id: prodkt.generated_sku,
        vendor_code: vendor_code,
        sku_description: sku_description,
      };
      var prod_obj = {
        ...prodkt,
        id: uuidv1(),
        isdefault,
        sku_weight,
        is_ready_to_ship: false,
        is_soldout: false,
        is_active: true,
        vendor_delivery_time: vendorleadtime,
        sku_id: lastsku_id,
        sku_url: sku_urlval,
      };
      uploaddescriptions.push(sku_desc);
      uploadskus.push(prod_obj);
    });

    // res.send(200,{skus:uploadskus})

    //   res.send(200,{count:product_skus.length});

    //        var productlist = [
    //         product_skus[0],
    //         product_skus[1]
    //     ]

    //res.json(product_skus);
    models.trans_sku_lists
      .bulkCreate(uploadskus, { individualHooks: true })
      .then(function (response) {
        models.trans_sku_descriptions
          .bulkCreate(uploaddescriptions, { individualHooks: true })
          .then(function (response) {
            // Notice: There are no arguments here, as of right now you'll have to...
            //   request({
            //     url: 'htts://api.stylori.net/updatepricelist',
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({req_product_id : product_id})
            // }, function(error, response, body) {
            //    console.log(body)
            //    console.log(response)

            // });
            //  const _obj = {
            //         method: "post",
            //         url: process.env.apibaseurl+"/esearch_forceindex",
            //         data: {
            //             product_id : prod_obj.product_id
            //         }
            //     };

            // axios(_obj)
            // 	  .then(async response => {
            //       }).catch({

            //       })

            res.json(uploadskus);
          });
      });

    //  res.send(200, { submitted: true })
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.updateproductimage = async (req, res) => {
  try {
    const { imageobj, isedit } = req.body;

    // console.log(JSON.stringify(req.body));
    let imgurl = imageobj.imageUrl;
    if (isedit) {
      let response_obj1 = await models.product_images.update(
        // Values to update
        {
          image_url: imgurl.replace("png", "jpg"),
        },
        {
          // Clause
          where: {
            id: imageobj.id,
          },
        }
      );
    } else {
      let newimage = {
        id: uuidv1(),
        image_url: imgurl.replace("png", "jpg"),
        product_id: imageobj.productId,
        product_color: imageobj.productColor,
        image_position: imageobj.imagePosition,
        ishover: imageobj.imagePosition == 2 ? true : false,
        isdefault: true,
        //isdefault: imageobj.imagePosition == 1 ? true : false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      let successmessage = await models.product_images.create(newimage);
    }
    res.send(200, { message: "Success" });
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.getproductvarient = async (req, res) => {
  try {
    const {
      productPuritiesByProductId,
      productDiamondTypes,
      productSize,
      productId,
      productMetalcoloursByProductId,
    } = req.body;
    var product_skus = [];
    var prev_skus = [];
    var skus = product_skus;
    var skuprefix = productId + "-";
    product_skus = [];
    var product_object = await models.product_lists.findOne({
      attributes: [
        "product_id",
        "size_varient",
        "product_type",
        "product_category",
        "product_name",
        "vendor_code",
      ],
      include: [
        {
          model: models.trans_sku_lists,
          attributes: ["generated_sku", "sku_id", "vendor_delivery_time"],
        },
        {
          model: models.product_purities,
        },
        {
          model: models.product_diamonds,
          attributes: ["diamond_type"],
          group: ["diamond_type"],
        },
        {
          model: models.product_metalcolours,
        },
        {
          model: models.product_gemstones,
        },
      ],
      where: {
        product_id: productId,
      },
    });

    let lastsku = await models.trans_sku_lists.findOne({
      attributes: ["sku_id"],
      where: {
        is_active: true,
      },
      order: [
        //  [ sequelize.cast(sequelize.col('sku_id'), 'BIGINT') , 'ASC' ]
        [sequelize.cast(sequelize.col("sku_id"), "BIGINT"), "DESC"],
      ],
    });
    var lastsku_id = parseInt(lastsku.sku_id);
    var vendor_delivery_time = 17;
    product_object.trans_sku_lists.forEach((skuid) => {
      prev_skus.push(skuid.generated_sku);
      vendor_delivery_time = skuid.vendor_delivery_time;
    });
    let diamonds;

    let purityobj = {};
    let masterpurity = await models.master_metals_purities.findAll();
    masterpurity.forEach((purity) => {
      purityobj[purity.name] = purity.short_code;
    });

    /****************puritylis */
    var purities = productPuritiesByProductId;
    var puritylist = product_object.product_purities;
    var purityarr = [];
    // puritylist.forEach(purity => {
    //     var sku = skuprefix + purityobj[purity.purity]
    //     var skuobj = {
    //         product_id: productId,
    //         product_type: product_object.product_type,
    //         service_name: product_object.vendor_code,
    //         product_series: 0,
    //         purity: purity.purity,
    //         generated_sku: sku
    //     }
    //     product_skus.push(skuobj)
    // })

    purities.forEach((purity_obj) => {
      var sku = skuprefix + purityobj[purity_obj.purity];
      var skuobj = {
        product_id: productId,
        product_type: product_object.product_type,
        service_name: product_object.vendor_code,
        product_series: 0,
        sku_weight: purity_obj.metal_weight,
        purity: purity_obj.purity,
        generated_sku: sku,
      };
      product_skus.push(skuobj);
    });

    /************************** */

    /****************metalcolor list */

    var colorlist = productMetalcoloursByProductId;
    var skus = product_skus;

    product_skus = [];
    let colorobj = {};
    let mastercolors = await models.master_metals_colors.findAll();
    mastercolors.forEach((color) => {
      colorobj[color.name] = color.short_code;
    });
    var metalcolorlist = product_object.product_metalcolours;
    // console.log("colorlist" + metalcolorlist.length);

    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;

      metalcolorlist.forEach((metalcolor) => {
        var sku = skuval + colorobj[metalcolor.product_color];

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          metal_color: metalcolor.product_color,
        };
        product_skus.push(skuobj);
      });

      colorlist.forEach((color) => {
        var sku = skuval + colorobj[color.name];

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          metal_color: color.name,
        };
        product_skus.push(skuobj);
      });
    });

    /************************ */
    /*****************Diamond list */
    var diamonds_arr = productDiamondTypes;
    var skus = product_skus;
    var diamondlist = product_object.product_diamonds;
    var prod_diamonds = [];
    diamondlist.forEach((diamondname) => {
      if (prod_diamonds.indexOf(diamondname.diamond_type) === -1) {
        prod_diamonds.push(diamondname.diamond_type);
      }
    });
    if (diamondlist.length > 0) {
      product_skus = [];
    }
    // console.log("diamondlength" + diamondlist.length);
    var diamond_sku_clarity = {};
    let diamondtype = await models.master_diamond_types.findAll({});
    diamondtype.forEach((diamond_type) => {
      var claritytype =
        diamond_type.diamond_color + diamond_type.diamond_clarity;
      diamond_sku_clarity[claritytype] = diamond_type.short_code;
    });

    var diamondsarr = [];
    var sku_prev = skus;

    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;
      // console.log(JSON.stringify(diamondlist));
      //diamond.diamond_type
      prod_diamonds.forEach((diamond) => {
        var clarity = diamond;
        // console.log("claritycolor" + JSON.stringify(diamond));
        var sku = skuval + diamond_sku_clarity[diamond];

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          diamond_color: diamond,
          diamond_type: diamond,
        };
        product_skus.push(skuobj);
      });

      // res.send(200,{product_skus})
      diamonds_arr.forEach((diamond) => {
        //            var clarity = diamond.diamondType
        var clarity = diamond.diamondColor + diamond.diamondClarity;
        // console.log("diamondvarient" + clarity);
        var sku = skuval + diamond_sku_clarity[clarity];
        // console.log("diamondvarient" + sku);

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          diamond_color: clarity,
          diamond_type: clarity,
        };
        product_skus.push(skuobj);
      });
    });

    /********************* */
    // console.log("product_skusvarient" + JSON.stringify(product_skus));

    //     /**************gemstonelist ***********/
    var gemstonecolorcode1 = "00";
    var gemstonecolorcode2 = "00";
    /************************************ */

    skus = product_skus;
    product_skus = [];
    skus.forEach((skuvalue) => {
      var sku =
        skuvalue.generated_sku + gemstonecolorcode1 + gemstonecolorcode2;

      var skuobj = {
        ...skuvalue,
        generated_sku: sku,
      };
      product_skus.push(skuobj);

      // product_skus.push(sku)
    });
    skus = product_skus;
    var size_arr = productSize;
    var sizes = [];
    if (product_object.size_varient) {
      sizes = product_object.size_varient.split(",");
    }
    if (sizes.length > 0 || size_arr.length > 0) {
      product_skus = [];
    }

    skus.forEach((skuvalue) => {
      sizes.forEach((sizeval) => {
        var sku = skuvalue.generated_sku + "-" + sizeval;

        var skuobj = {
          ...skuvalue,
          sku_size: sizeval,
          generated_sku: sku,
        };
        product_skus.push(skuobj);

        // product_skus.push(sku)
      });
      size_arr.forEach((sizeval) => {
        var sku = skuvalue.generated_sku + "-" + sizeval;

        var skuobj = {
          ...skuvalue,
          is_active: true,
          generated_sku: sku,
          sku_size: sizevalue,
        };
        product_skus.push(skuobj);

        // product_skus.push(sku)
      });
    });

    if (product_skus.length == 0) {
      product_skus = skus;
    }

    var newskus = [];
    var product_skus_description = [];
    let prodname = product_object.product_name;
    let sku_prodname = prodname.replace(/\s/g, "-");
    var sku_description = "";

    let sku_url =
      product_object.product_category.toLowerCase() +
      "/" +
      product_object.product_type.toLowerCase() +
      "/" +
      sku_prodname +
      "?sku_id=";
    product_skus.forEach((sku) => {
      if (prev_skus.indexOf(sku.generated_sku) === -1) {
        lastsku_id = lastsku_id + 1;
        let sku_urlval = sku_url + lastsku_id;
        var skuobj = {
          id: uuidv1(),
          product_id: sku.product_id,
          product_type: sku.product_type,
          diamond_type: sku.diamond_type,
          metal_color: sku.metal_color,
          generated_sku: sku.generated_sku,
          sku_id: "" + lastsku_id,
          sku_url: sku_urlval,
          purity: sku.purity,
          sku_size: sku.sku_size,
          is_ready_to_ship: false,
          is_soldout: false,
          isdefault: false,
          vendor_delivery_time: vendor_delivery_time,
          is_active: true,
        };
        var sku_description_obj = {
          id: uuidv1(),
          sku_id: sku.generated_sku,
          vendor_code: skuobj.metal_color,
          sku_description: sku_description,
          vendor_lead_time: skuobj.vendor_leadtime,
          isactive: true,
        };
        //  if(skuproceecount >= 4478)
        //   {
        newskus.push(skuobj);
        product_skus_description.push(sku_description_obj);
      }
    });

    updatediscountsku(product_object.product_id);
    //res.send(200,{message: newskus})
    models.trans_sku_lists
      .bulkCreate(newskus, { individualHooks: true })
      .then(function (response) {
        models.trans_sku_descriptions
          .bulkCreate(product_skus_description, { individualHooks: true })
          .then(function (response) {
            // console.log("porductskudescsuccess");
            // if(product_sku_arr.length > skuproceecount)
            // {
            //     insertsku(skuproceecount);
            // }else{
            res.send(200, { message: newskus, product_skus_description });

            //}
          })
          .catch((error) => {
            console.log("errorresponse" + error.message);
          });
      })
      .catch((error) => {
        res.send(200, {
          message: "Please Try Again" + error,
          newskus,
          product_skus_description,
        });
      });

    // var purityarr = []
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.editproductdiamond = async (req, res) => {
  try {
    const {
      diamondid,
      diamondSettings,
      diamondShape,
      stoneCount,
      stoneWeight,
    } = req.body;
    // console.log(diamondid);
    let response_obj1 = await models.product_diamonds.update(
      // Values to update
      {
        diamond_settings: diamondSettings,
        diamond_shape: diamondShape,
        stone_count: stoneCount,
        stone_weight: stoneWeight,
      },
      {
        // Clause
        where: {
          id: diamondid,
        },
      }
    );
    if (response_obj1[0] > 0) {
      res.send(200, { message: "success" });
    } else {
      res.send(402, { message: "Try again later" });
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.editproductgemstone = async (req, res) => {
  try {
    const {
      id,
      gemstoneSetting,
      gemstoneShape,
      gemstoneSize,
      stoneCount,
      stoneWeight,
    } = req.body;
    // console.log(id);
    let response_obj1 = await models.product_gemstones.update(
      // Values to update
      {
        gemstone_setting: gemstoneSetting,
        gemstone_shape: gemstoneShape,
        gemstone_size: gemstoneSize,
        stone_weight: stoneWeight,
        stone_count: stoneCount,
      },
      {
        // Clause
        where: {
          id: id,
        },
      }
    );
    if (response_obj1[0] > 0) {
      res.send(200, { message: "success" });
    } else {
      res.send(402, { message: "Try again later" });
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.updateskuinfo = async (req, res) => {
  try {
    const {
      generatedSku,
      vendorDeliveryTime,
      discount,
      isdefault,
      isActive,
      isReadyToShip,
      approxMetalWeight,
    } = req.body;
    let response_obj1 = await models.trans_sku_lists.update(
      // Values to update
      {
        sku_weight: approxMetalWeight,
        vendor_delivery_time: vendorDeliveryTime,
        isdefault: isdefault,
        is_active: isActive,
        discount_desc: discount,
        is_ready_to_ship: isReadyToShip,
      },
      {
        // Clause
        where: {
          generated_sku: generatedSku,
        },
        returning: true,
        raw: true,
      }
    );
    if (response_obj1[0] > 0) {
      let productId = response_obj1[1][0].product_id;
      let product = await models.product_lists.findAll({
        where: {
          product_type: {
            [models.Sequelize.Op.iLike]: "rings",
          },
          product_id: productId,
        },
      });
      if (product.length > 0) {
        await models.sequelize
          .query(`update product_lists p set size_varient = sizes,colour_varient = color
    from 
    (
    select 
      string_agg(distinct(sku_size),',') as sizes,
      string_agg(distinct(purity||' '||metal_color),',') as color,
      product_id
    from trans_sku_lists where product_id = '${productId}' and is_active is true
    group by product_id 
    ) as sub 
    where p.product_id = sub.product_id`);
      }
      res.send(200, { message: "success", productId });
    } else {
      res.send(402, { message: "Try again later" });
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.updateskupriceinfo = async (req, res) => {
  try {
    const {
      generatedSku,
      costPrice,
      costPriceTax,
      sellingPrice,
      markupPrice,
      discountPrice,
      sellingPriceTax,
      markupPriceTax,
      discountPriceTax,
    } = req.body;
    let response_obj1 = await models.trans_sku_lists.update(
      // Values to update
      {
        cost_price: costPrice,
        selling_price: sellingPrice,
        markup_price: markupPrice,
        discount_price: discountPrice,
        cost_price_tax: costPriceTax,
        selling_price_tax: sellingPriceTax,
        markup_price_tax: markupPriceTax,
        discount_price_tax: discountPriceTax,
      },
      {
        // Clause
        where: {
          generated_sku: generatedSku,
        },
      }
    );
    if (response_obj1[0] > 0) {
      res.send(200, { message: "success" });
    } else {
      res.send(402, { message: "Try again later" });
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
exports.editproduct = async (req, res) => {
  try {
    const {
      productId,
      productName,
      themes,
      styles,
      occassions,
      collections,
      stonecount,
      stonecolour,
      gender,
      length,
      width,
      height,
      description,
      minOrderQty,
      maxOrderQty,
      productType,
      productMetalColor,
      vendorCode,
      earingBacking,
      productSize,
    } = req.body;

    var product_object = await models.product_lists.findOne({
      include: [
        {
          model: models.product_themes,
          attributes: [["theme_name", "name"]],
        },
        {
          model: models.product_styles,
          attributes: [["style_name", "name"]],
        },
        {
          model: models.product_occassions,
          attributes: [["occassion_name", "name"]],
        },
        {
          model: models.product_collections,
          attributes: [["collection_name", "name"]],
        },

        {
          model: models.product_stonecount,
          attributes: [["stonecount", "name"]],
        },
        {
          model: models.product_stonecolor,
          attributes: [["stonecolor", "name"]],
        },
        {
          model: models.product_gender,
          attributes: [["gender_name", "name"]],
        },
      ],
      where: {
        product_id: productId,
      },
    });

    product_object = JSON.parse(JSON.stringify(product_object));

    let processItems = () => {
      return new Promise(async (resolve, reject) => {
        let modelNamesToDeactivate = {
          product_collections: {
            modelName: "product_collections",
            reqBody: collections,
            objectKey: "collectionName",
            modelKey: "collection_name",
          },
          product_occassions: {
            modelName: "product_occassions",
            reqBody: occassions,
            objectKey: "occassionName",
            modelKey: "occassion_name",
          },
          product_themes: {
            modelName: "product_themes",
            reqBody: themes,
            objectKey: "themeName",
            modelKey: "theme_name",
          },
          product_styles: {
            modelName: "product_styles",
            reqBody: styles,
            objectKey: "styleName",
            modelKey: "style_name",
          },
          product_stonecounts: {
            modelName: "product_stonecount",
            reqBody: stonecount,
            objectKey: "stonecount",
            modelKey: "stonecount",
          },
          product_stonecolors: {
            modelName: "product_stonecolor",
            reqBody: stonecolour,
            objectKey: "stonecolor",
            modelKey: "stonecolor",
          },
          product_genders: {
            modelName: "product_gender",
            reqBody: gender,
            objectKey: "label",
            modelKey: "gender_name",
          },
        };
        let process = Object.keys(modelNamesToDeactivate);
        for (let index = 0; index < process.length; index++) {
          const item = process[index];
          //Existing Values to be deactivated
          await models[modelNamesToDeactivate[item].modelName].update(
            { is_active: false },
            {
              where: {
                product_id: productId,
              },
            }
          );
          let tempItems = [];
          if (product_object[item] && product_object[item].length) {
            product_object[item].forEach((element) => {
              tempItems.push(element.name);
            });
          }
          let newItems = [],
            oldItems = [];
          modelNamesToDeactivate[item].reqBody.forEach((element) => {
            if (
              tempItems.indexOf(
                element[modelNamesToDeactivate[item].objectKey]
              ) === -1
            ) {
              newItems.push({
                id: uuidv1(),
                product_id: productId,
                [modelNamesToDeactivate[item].modelKey]:
                  element[modelNamesToDeactivate[item].objectKey],
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            } else {
              oldItems.push(element[modelNamesToDeactivate[item].objectKey]);
            }
          });
          await models[modelNamesToDeactivate[item].modelName].update(
            { is_active: true },
            {
              where: {
                [modelNamesToDeactivate[item].modelKey]: {
                  [Op.in]: oldItems,
                },
                product_id: productId,
              },
            }
          );
          if (newItems.length) {
            await models[modelNamesToDeactivate[item].modelName].bulkCreate(
              newItems,
              { individualHooks: true }
            );
          }
        }
        resolve("Completed");
      });
    };

    await processItems();

    let trans_sku_lists = await models.trans_sku_lists.update(
      {
        min_order_qty: minOrderQty,
        max_order_qty: maxOrderQty,
        sku_size: productSize,
      },
      {
        returning: true,
        logging: console.log,
        raw: true,
        where: { product_id: productId },
      }
    );
    await models.product_lists.update(
      // Values to update
      {
        product_name: productName,
        length,
        width,
        height,
        vendor_code: vendorCode,
        gender: gender.map((i) => i.label).join(),
        earring_backing: earingBacking,
      },
      {
        where: {
          product_id: productId,
        },
      }
    );

    res.status(200).send({ message: "Product Updated Successfully!" });
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.disableproduct = async (req, res) => {
  try {
    const { productid, isactive } = req.body;
    try {
      await models.product_lists.update(
        // Values to update
        {
          isactive: isactive,
        },
        {
          // Clause
          where: {
            product_id: productid,
          },
        }
      );
      res.send(200, { message: "Updated Successfully" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.getproductlist = async (req, res) => {
  try {
    const {
      size,
      offset,
      productcategory,
      producttype,
      searchtext,
      order,
      orderby,
    } = req.body;
    let whereclause = {};
    var sort = "DESC";
    var orderbycolumn = "updatedAt";
    if (orderby) {
      orderbycolumn = orderby;
    }
    if (order) {
      sort = order.toUpperCase();
    }
    //    if(order)
    //    {
    //     sort = 'ASC'
    //    }
    if (searchtext) {
      whereclause = {
        [Op.or]: [
          {
            product_id: {
              [Op.iLike]: "%" + searchtext + "%",
            },
          },
          {
            product_name: {
              [Op.iLike]: "%" + searchtext + "%",
            },
          },
        ],
      };
    }
    if (productcategory) {
      whereclause["product_category"] = productcategory;
    }

    if (producttype) {
      whereclause["product_type"] = producttype;
    }

    let products = await models.product_lists.findAndCountAll({
      where: whereclause,
      offset: offset,
      limit: size,
      order: [[orderbycolumn, sort]],
    });

    res.send(200, { products });
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.getorderlist = async (req, res) => {
  try {
    const { size, offset, searchtext, order, orderby } = req.body;
    let whereclause = {};
    var sort = "DESC";
    var orderbycolumn = "updatedAt";
    if (orderby) {
      orderbycolumn = orderby;
    }
    if (order) {
      sort = order.toUpperCase();
    }
    //    if(order)
    //    {
    //     sort = 'ASC'
    //    }
    if (searchtext) {
      whereclause = {
        [Op.or]: [
          {
            product_id: {
              [Op.iLike]: "%" + searchtext + "%",
            },
          },
          {
            product_name: {
              [Op.iLike]: "%" + searchtext + "%",
            },
          },
        ],
      };
    }

    let orders = await models.orders.findAndCountAll({
      include: [
        {
          model: models.shopping_cart,
          include: [
            {
              model: models.shopping_cart_item,
            },
          ],
        },
      ],
      where: whereclause,
      offset: offset,
      limit: size,
      order: [[orderbycolumn, sort]],
    });

    res.send(200, { orders });
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.getorderdetails = async (req, res) => {
  try {
    const { order_id } = req.body;
    let whereclause = {
      id: order_id,
    };

    let orders = await models.orders.findOne({
      include: [
        {
          model: models.user_profiles,
        },

        {
          model: models.shopping_cart,
          include: [
            {
              model: models.shopping_cart_item,
              include: [
                {
                  model: models.trans_sku_lists,
                },
              ],
            },
            {
              model: models.giftwrap,
            },
            {
              model: models.cart_address,
              where: {
                address_type: 1,
              },
            },
          ],
        },
      ],
      where: whereclause,
    });
    /*  include: [
              {
                model: models.trans_sku_lists,
                include: [
                  {
                    model: models.product_lists,
                    include: [
                      {
                        model: models.product_images,
                        raw : true,
                        as : 'productImagesByProductId'
                      },
                    ],
                  },
                ],
              },
            ],
            */
    let skuids = [];
    if (orders) {
      if (orders.shopping_cart) {
        if (orders.shopping_cart.shopping_cart_items) {
          orders.shopping_cart.shopping_cart_items.forEach((cartitem) => {
            skuids.push(cartitem.product_sku);
          });
        }
      }
    }
    let proddetail = [];
    if (skuids.length > 0) {
      proddetail = await models.trans_sku_lists.findAll({
        attributes: ["generated_sku"],
        include: [
          {
            model: models.product_lists,
            attributes: ["product_name", "product_id"],
            include: [
              {
                model: models.product_images,
                attributes: ["image_url", "image_position"],
              },
            ],
          },
        ],
        where: {
          generated_sku: {
            [Op.in]: skuids,
          },
          metal_color: {
            [Op.eq]: models.sequelize.literal(
              `"product_list->product_images"."product_color"`
            ),
          },
        },
        order: [
          models.sequelize.literal(
            `"product_list->product_images"."image_position"`
          ),
        ],
      });
    }

    res.send(200, { orders, product_detail: proddetail });
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.getproducturl = async (req, res) => {
  try {
    const { productid } = req.body;

    let sku_details = await models.trans_sku_lists.findOne({
      attributes: ["sku_url"],
      where: {
        isdefault: true,
        product_id: productid,
      },
    });
    let url = process.env.baseweburl + `${sku_details.sku_url}`;
    res.status(200).send({ url: url });
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

exports.productdetails = async (req, res) => {
  try {
    const {
      size,
      offset,
      productcategory,
      producttype,
      searchtext,
      order,
      orderby,
    } = req.body;
    let whereclause = {
      isactive: true,
      product_id: {
        [Op.notILike]: "%SR%",
      },
    };
    let products = await models.product_lists.findAll({
      where: whereclause,
      attributes: ["product_type", "product_name", "product_category"],
      include: [
        {
          model: models.trans_sku_lists,
          attributes: [
            "purity",
            "diamond_type",
            "generated_sku",
            "sku_url",
            "markup_price",
            "selling_price",
            "discount_price",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: models.trans_sku_descriptions,
            },
          ],
          where: {
            isdefault: true,
          },
        },
        {
          model: models.product_images,
          attributes: ["image_url"],
          where: {
            isdefault: true,
            image_position: 1,
          },
        },
        {
          model: models.product_collections,
          attributes: ["collection_name"],
        },
        {
          model: models.product_materials,
          attributes: ["material_name"],
        },
      ],
      where: {
        isactive: true,
      },
      //limit: 10,
    });
    var res_json = [];
    let now = new moment();
    products.forEach((prod) => {
      let materials = [];
      prod.product_materials.forEach((mat_obj) => {
        materials.push(mat_obj.material_name);
      });
      let collections = [];
      prod.product_collections.forEach((col_obj) => {
        collections.push(col_obj.collection_name);
      });
      var prod_img_url = "";
      if (prod.product_images[0].image_url) {
        let components_arr = prod.product_images[0].image_url.split("/");
        components_arr.insert(2, "1000X1000");
        prod_img_url = components_arr.join("/");
      }
      var res_json_obj = {
        id: prod.trans_sku_lists[0].generated_sku,
        description:
          prod.trans_sku_lists[0].trans_sku_description.sku_description,
        google_product_category: prod.product_category,
        "Product Name": prod.product_name,
        product_type: prod.product_type,
        link: process.env.baseweburl + prod.trans_sku_lists[0].sku_url,
        image_link:
          prod.product_images.length > 0
            ? process.env.baseimageurl + prod_img_url
            : "",
        condition:
          moment
            .duration(now.diff(moment(prod.trans_sku_lists[0].createdAt)))
            .as("days") >= 10
            ? "old"
            : "new",
        availability: "In Stock",
        price: "INR" + prod.trans_sku_lists[0].discount_price,
        sale_price: "INR" + prod.trans_sku_lists[0].selling_price,
        sale_price_effective_date: moment(prod.trans_sku_lists[0].updatedAt),
        brand: "Stylori",
        color: prod.trans_sku_lists[0].metal_color,
        metal: materials,
        collections: collections,
      };
      res_json.push(res_json_obj);
    });
    res.send(200, { res_json });
  } catch (error) {
    res.send(400, { error: error.message });
  }
};

exports.productupload2 = async (req, res) => {
  try {
    var apidata = req.body;
    var product_skus = [];
    var skuurl = "";
    // console.log(JSON.stringify(apidata));
    var categoryobj = apidata.product_categoy;
    var categoryval = categoryobj.charAt(0);
    var producttypeobj = apidata.product_type;
    var producttypeval = producttypeobj.shortCode;
    var seriesvalue = apidata.startcode + 1;
    // console.log("i am here");
    // console.log(seriesvalue);
    skuurl = categoryobj;
    if (Number.isNaN(seriesvalue)) {
      // console.log("i am here");
      seriesvalue = 3000;
    }
    if (categoryobj !== producttypeobj.name) {
      skuurl = skuurl + "/" + producttypeobj.name;
    }
    let lastsku = await models.trans_sku_lists.findOne({
      attributes: ["sku_id"],
      where: {
        is_active: true,
      },
      order: [
        //  [ sequelize.cast(sequelize.col('sku_id'), 'BIGINT') , 'ASC' ]
        [sequelize.cast(sequelize.col("sku_id"), "BIGINT"), "DESC"],
      ],
    });
    var lastsku_id = parseInt(lastsku.sku_id);

    let final_series = await models.product_lists.findOne({
      order: [["product_series", "DESC"]],
      attributes: ["product_series"],
    });
    var product_series = 3001;
    if (final_series) {
      product_series = final_series.product_series + 1;
    }
    var product_id = "S" + producttypeval + product_series;

    var skuprefix = "S" + producttypeval + product_series + "-";

    var product_name = apidata.productname;
    var product_category = apidata.product_categoy;
    var product_type = apidata.product_type.name;
    var gender = apidata.selectedgender;
    var vendorname = apidata.vendorcode.name;
    var vendor_code = apidata.vendorcode.shortCode;
    var product_series = product_series;
    var height = apidata.metal_height;
    var width = apidata.metal_width;
    var length = apidata.metal_length;
    var productsizes = apidata.selected_sizes;
    var productcolors = apidata.metalcolour;
    var productpurity = apidata.metalpurity;
    var isreorderable = apidata.isreorderable;
    var product_vendor_code = apidata.productvendorcode;
    var default_size = apidata.default_size;
    var default_metal_color = apidata.default_metal_colour;
    var default_metal_purity = apidata.default_metal_purity;
    var materials = apidata.material_names;
    var default_metal_size = apidata.default_size;
    var stonecolour_lists = apidata.stonecolour;
    var stonecount_lists = apidata.stonecount;
    var vendorleadtime = apidata.vendorleadtime;

    var product_images = apidata.product_images;
    var size_varient = "";

    if (productsizes) {
      size_varient = productsizes.join(",");
    }

    var default_weight = apidata[default_metal_purity + "_metal_weight"];

    var isreorderable = false;
    if (apidata.isreorderable === "Yes") {
      isreorderable = true;
    }
    var colour_varient = "";
    var diamondlist = [];
    var gemstonelist = [];
    var product_collections = apidata.collections;
    var product_occassions = apidata.occassions;
    var product_themes = apidata.themes;
    var product_styles = apidata.prod_styles;

    var metals = apidata.metals;

    metals.forEach((element) => {
      if (element.metalname === "Diamond") {
        diamondlist.push(element);
      }
      if (element.metalname === "Gemstone") {
        gemstonelist.push(element);
      }
    });

    if (productcolors && productpurity) {
      var colorarr = [];
      productpurity.forEach((purityelement) => {
        productcolors.forEach((colorelement) => {
          colorarr.push(purityelement.name + " " + colorelement.name);
        });
      });
      colour_varient = colorarr.join(",");
    }

    var product_obj = {
      id: uuidv1(),
      product_id,
      product_series,
      vendor_code,
      product_name,
      product_category,
      isactive: false,
      default_weight,
      gender,
      height,
      width,
      length,
      product_type,
      product_vendor_code,
      default_size,
      size_varient,
      colour_varient,
      isreorderable,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let sku_url =
      product_obj.product_category.toLowerCase() +
      "/" +
      product_obj.product_type.toLowerCase() +
      "/" +
      product_obj.product_name.replace(" ", "-") +
      "?sku_id=";

    let successmessage = await models.product_lists.create(product_obj);
    let product_category_obj = await models.master_product_categories.findOne({
      where: {
        name: product_category,
      },
    });
    // console.log("XXXXXXXXX");
    // console.log(JSON.stringify(product_category_obj));
    // console.log("XXXXXXXXX");
    /*************** images list ********************/
    var prod_images = [];
    if (Object.keys(product_images)) {
      Object.keys(product_images).forEach((key) => {
        let images_arr = product_images[key];
        var imgposition = 0;
        images_arr.forEach((element) => {
          let ishover = false;
          let isdefault = false;
          imgposition = imgposition + 1;
          if (imgposition == 2) {
            ishover = true;
          }
          if (element.position == 1) {
            isdefault = true;
          }
          var image_obj = {
            id: uuidv1(),
            product_id: successmessage.product_id,
            product_color: element.color,
            image_url: element.image_url,
            image_position: imgposition,
            ishover,
            isdefault: default_metal_color === element.color ? true : false,
          };
          prod_images.push(image_obj);
        });
      });
      // console.log(JSON.stringify(prod_images));
      await models.product_images.bulkCreate(prod_images, {
        individualHooks: true,
      });
    }
    /*************** add gender ********************/
    if (gender) {
      const genderobj = {
        id: uuidv1(),
        gender_name: gender,
        product_id: product_obj.product_id,
        is_active: true,
      };
      // console.log("XXXXXXXXX");
      // console.log(JSON.stringify(genderobj));
      // console.log("XXXXXXXXX");
      await models.product_gender.create(genderobj);
    }

    /*************** purity list ********************/
    var puritylist = apidata.metalpurity;
    var purityarr = [];
    puritylist.forEach((purity) => {
      const purityobj = {
        id: uuidv1(),
        purity: purity.name,
        product_id: product_obj.product_id,
        is_active: true,
      };
      purityarr.push(purityobj);
      var sku = skuprefix + purity.shortCode;
      var skuobj = {
        product_id: successmessage.product_id,
        product_type: producttypeval,
        service_name: vendorname,
        product_series: seriesvalue,
        purity: purity.name,
        generated_sku: sku,
      };
      product_skus.push(skuobj);
    });
    if (puritylist) {
      await models.product_purities.bulkCreate(purityarr, {
        individualHooks: true,
      });
    }
    // console.log("puritylistcount");
    // console.log(product_skus.length);
    /************ product stone colour */
    var stonecolourarr = [];

    if (stonecolour_lists) {
      stonecolour_lists.forEach((stonecolourobj) => {
        const stone_colour_obj = {
          id: uuidv1(),
          stonecolor: stonecolourobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        stonecolourarr.push(stone_colour_obj);
      });

      await models.product_stonecolor.bulkCreate(stonecolourarr, {
        individualHooks: true,
      });
    }
    /******************************** */

    /************ product stone count */
    var stonecountsarr = [];

    if (stonecount_lists) {
      stonecount_lists.forEach((stonecountobj) => {
        const stone_count_obj = {
          id: uuidv1(),
          stonecount: stonecountobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        stonecountsarr.push(stone_count_obj);
      });

      await models.product_stonecount.bulkCreate(stonecountsarr, {
        individualHooks: true,
      });
    }
    /******************************** */

    var collection_arr = [];
    if (product_collections) {
      product_collections.forEach((collectonobj) => {
        const collection = {
          id: uuidv1(),
          collection_name: collectonobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        collection_arr.push(collection);
      });

      await models.product_collections.bulkCreate(collection_arr, {
        individualHooks: true,
      });
    }

    var occassions_arr = [];
    if (product_occassions) {
      product_occassions.forEach((occassionsobj) => {
        const occassion = {
          id: uuidv1(),
          occassion_name: occassionsobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        occassions_arr.push(occassion);
      });
      await models.product_occassions.bulkCreate(occassions_arr, {
        individualHooks: true,
      });
    }

    var styles_arr = [];
    if (product_styles) {
      product_styles.forEach((styleobj) => {
        const style = {
          id: uuidv1(),
          style_name: styleobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        styles_arr.push(style);
      });
      await models.product_styles.bulkCreate(styles_arr, {
        individualHooks: true,
      });
    }

    var themes_arr = [];
    if (product_themes) {
      product_themes.forEach((themeobj) => {
        const style = {
          id: uuidv1(),
          theme_name: themeobj,
          product_id: product_obj.product_id,
          is_active: true,
        };
        themes_arr.push(style);
      });
      await models.product_themes.bulkCreate(themes_arr, {
        individualHooks: true,
      });
    }

    var material_arr = [];
    if (materials) {
      materials.forEach((materialobj) => {
        const metal_obj = {
          id: uuidv1(),
          material_name: materialobj,
          product_sku: product_obj.product_id,
          is_active: true,
        };
        material_arr.push(metal_obj);
      });
      await models.product_materials.bulkCreate(material_arr, {
        individualHooks: true,
      });

      if (materials.indexOf("Diamond") > -1) {
        skuurl = skuurl + "/" + "Diamond";
      } else if (materials.indexOf("Gemstone") > -1) {
        skuurl = skuurl + "/" + "Gemstone";
      } else {
        skuurl = skuurl + "/" + materials[0];
      }
    }

    var skus = product_skus;

    product_skus = [];
    var metalcolorlist = apidata.metalcolour;

    /*************** add metalcolor ********************/

    var metal_color_arr = [];
    if (metalcolorlist) {
      metalcolorlist.forEach((metalcolorobj) => {
        const colorobj = {
          id: uuidv1(),
          product_color: metalcolorobj.name,
          product_id: product_obj.product_id,
          is_active: true,
        };
        metal_color_arr.push(colorobj);
      });
      await models.product_metalcolours.bulkCreate(metal_color_arr, {
        individualHooks: true,
      });
    }
    /****************** */

    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;

      metalcolorlist.forEach((metalcolor) => {
        var sku = skuval + metalcolor.shortCode;

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          metal_color: metalcolor.name,
        };
        product_skus.push(skuobj);
      });
    });
    // console.log("metalcolorlistcount");
    // console.log(product_skus.length);

    /*************** Diamond Lists ********************/
    var skus = product_skus;

    product_skus = [];
    var diamond_sku_clarity = {};
    let diamondtype = await models.master_diamond_types.findAll({});
    diamondtype.forEach((diamond_type) => {
      var claritytype =
        diamond_type.diamond_color + diamond_type.diamond_clarity;
      diamond_sku_clarity[claritytype] = diamond_type.short_code;
    });
    var diamondsarr = [];
    diamondlist.forEach((diamond) => {
      var clarity = diamond.clarity.name + diamond.color.shortCode;

      const diamonval = {
        id: uuidv1(),
        diamond_colour: diamond.color.shortCode,
        diamond_clarity: diamond.clarity.name,
        diamond_settings: diamond.settings.name,
        diamond_shape: diamond.shape.name,
        stone_count: diamond.count,
        diamond_type: clarity,
        stone_weight: diamond.weight,
        product_sku: product_obj.product_id,
      };
      diamondsarr.push(diamonval);
    });
    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;

      diamondlist.forEach((diamond) => {
        var clarity = diamond.clarity.name + diamond.color.shortCode;

        var sku = skuval + diamond_sku_clarity[clarity];

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          diamond_color: diamond.color.shortCode,
          diamond_type: clarity,
        };
        product_skus.push(skuobj);
      });
    });
    if (product_skus.length == 0) {
      product_skus = skus;
    }
    await models.product_diamonds.bulkCreate(diamondsarr, {
      individualHooks: true,
    });
    // console.log("diamndlistcount");
    // console.log(product_skus.length);

    /*************** gemstone Lists ********************/

    skus = product_skus;
    var gemstonearr = [];
    var gemstonesku = "";
    var gemstonecolorcode1 = "00";
    var gemstonecolorcode2 = "00";
    var gemstoneshortcode = "00";
    var gemstonecolorcode2 = "00";
    gemstonelist.forEach((gem) => {
      const gemstone_obj = {
        id: uuidv1(),
        gemstone_type: gem.clarity.name,
        gemstone_shape: gem.color.name,
        gemstone_setting: gem.settings.name,
        gemstone_size: gem.shape,
        stone_count: gem.count,
        stone_weight: gem.weight,
        product_sku: product_obj.product_id,
      };

      gemstonearr.push(gemstone_obj);
    });

    await models.product_gemstones.bulkCreate(gemstonearr, {
      individualHooks: true,
    });
    if (gemstonelist.length > 0) {
      var firstgemobj = gemstonelist[0];
      gemstoneshortcode = firstgemobj.clarity.shortCode;
      gemstonesku = firstgemobj.clarity.colorCode;
      gemstonecolorcode1 = firstgemobj.clarity.colorCode;
    }
    if (gemstonelist.length > 1) {
      var secondgemobj = gemstonelist[1];

      gemstonesku = gemstonesku + secondgemobj.clarity.colorCode;
      gemstonecolorcode2 = secondgemobj.clarity.colorCode;
    }

    product_skus = [];
    skus.forEach((skuvalue) => {
      var sku =
        skuvalue.generated_sku + gemstonecolorcode1 + gemstonecolorcode2;

      var skuobj = {
        ...skuvalue,
        generated_sku: sku,
      };
      product_skus.push(skuobj);

      // product_skus.push(sku)
    });
    // console.log("gemslistcount");
    // console.log(product_skus.length);

    /* Applying Dynamic Filters here  */
    const masterAttributes = await loadMasterAttributes();

    let filterKeys = {
      collections: "Collection",
      material_names: "Material",
      metalcolour: "Metal Colour",
      metalpurity: "Metal Purity",
      occassions: "Occasion",
      prod_styles: "Style",
      product_categoy: "Category",
      product_type: "Product Type",
      selectedgender: "Gender",
      themes: "Theme",
    };

    let product_attribute = [];

    for (const item of Object.keys(filterKeys)) {
      if (Array.isArray(apidata[item])) {
        let tempData = apidata[item];
        if (["metalpurity", "metalcolour"].includes(item)) {
          tempData = apidata[item].map((i) => i?.name);
        }
        product_attribute = [
          ...product_attribute,
          ...tempData.map((i) => {
            return {
              product_id,
              is_active: true,
              master_id: masterAttributes[filterKeys[item]].id,
              attribute_name: i,
              attribute_id: masterAttributes[filterKeys[item]].attributes[i],
            };
          }),
        ];
      } else {
        let tempData = apidata[item];
        if (item == "product_type") {
          tempData = tempData?.name;
        }
        product_attribute = [
          ...product_attribute,
          {
            product_id,
            is_active: true,
            master_id: masterAttributes[filterKeys[item]].id,
            attribute_name: tempData,
            attribute_id:
              masterAttributes[filterKeys[item]].attributes[tempData],
          },
        ];
      }
    }
    await models.product_attribute.bulkCreate(product_attribute);
    /* End of Applying Dynamic Filters */

    if (product_skus.length == 0) {
      product_skus = skus;
    }
    /*************** Size Lists ********************/

    skus = product_skus;
    product_skus = [];
    var sizelist = apidata.selected_sizes;
    // console.log(sizelist.length);
    skus.forEach((skuvalue) => {
      sizelist.forEach((sizevalue) => {
        var sku = skuvalue.generated_sku + "_" + sizevalue;

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          sku_size: sizevalue,
        };
        product_skus.push(skuobj);
      });
    });
    if (product_skus.length == 0) {
      product_skus = skus;
    }
    // console.log("size" + product_skus.length);
    // console.log("sizelistcount");
    // console.log(product_skus.length);

    var uploadskus = [];
    var uploaddescriptions = [];
    product_skus.forEach((prodkt) => {
      var isdefault = false;
      var keyvalue = prodkt.purity + "_metal_weight";
      // console.log("productweight");
      // console.log(keyvalue);

      var sku_weight = apidata[keyvalue];
      // console.log(sku_weight);

      if (
        prodkt.metal_color === default_metal_color &&
        prodkt.purity === default_metal_purity &&
        prodkt.sku_size === default_metal_size
      ) {
        isdefault = true;
      }

      if (
        apidata.product_type.shortCode.toLowerCase() === "r" ||
        apidata.product_type.shortCode.toLowerCase() == "b"
      ) {
        const sizedifferent =
          parseFloat(prodkt.sku_size) - parseFloat(default_metal_size);
        // console.log(">sizedifference" + sizedifferent);
        // console.log(">sku_weight" + parseFloat(sku_weight));

        sku_weight =
          parseFloat(sku_weight) + Math.round(sizedifferent * 0.1 * 100) / 100;
        sku_weight = Math.round(sku_weight * 100) / 100;
      } else {
        sku_weight = Math.round(parseFloat(sku_weight) * 100) / 100;
      }
      lastsku_id = lastsku_id + 1;
      let sku_urlval = sku_url + lastsku_id;
      var sku_description =
        product_obj.product_type +
        "set in " +
        prodkt.purity +
        " " +
        prodkt.metal_color;
      if (materials.length > 0) {
        sku_description =
          sku_description + " " + materials[0] + " " + sku_weight + " gm";
      }
      if (diamondlist.length > 0) {
        sku_description = sku_description + "with Diamonds (";
        diamondlist.forEach((diamondobj) => {
          var clarity = diamondobj.clarity.name + diamondobj.color.shortCode;
          var diamondweight = diamondobj.weight;
          sku_description = sku_description + diamondweight + "ct " + clarity;
        });
        sku_description = sku_description + " )";
      }
      if (gemstonelist.length > 0) {
        if (diamondlist.length == 0) {
          sku_description = sku_description + "with Gemstones (";
        }
        gemstonelist.forEach((gem) => {
          var gemname = gem.clarity.name;
          sku_description = sku_description + " " + gemname;
        });

        sku_description = sku_description + " )";
      }
      const sku_desc = {
        id: uuidv1(),
        sku_id: prodkt.generated_sku,
        vendor_code: vendor_code,
        sku_description: sku_description,
      };
      var prod_obj = {
        ...prodkt,
        id: uuidv1(),
        isdefault,
        sku_weight,
        is_ready_to_ship: false,
        is_soldout: false,
        is_active: true,
        vendor_delivery_time: vendorleadtime,
        sku_id: lastsku_id,
        sku_url: sku_urlval,
      };
      uploaddescriptions.push(sku_desc);
      uploadskus.push(prod_obj);
    });
    // res.send(200,{skus:uploadskus})

    //   res.send(200,{count:product_skus.length});

    //        var productlist = [
    //         product_skus[0],
    //         product_skus[1]
    //     ]

    //res.json(product_skus);
    models.trans_sku_lists
      .bulkCreate(uploadskus, { individualHooks: true })
      .then(function (response) {
        models.trans_sku_descriptions
          .bulkCreate(uploaddescriptions, { individualHooks: true })
          .then(function (response) {
            // Notice: There are no arguments here, as of right now you'll have to...
            //   request({
            //     url: 'htts://api.stylori.net/updatepricelist',
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({req_product_id : product_id})
            // }, function(error, response, body) {
            //    console.log(body)
            //    console.log(response)

            // });
            //  const _obj = {
            //         method: "post",
            //         url: process.env.apibaseurl+"/esearch_forceindex",
            //         data: {
            //             product_id : prod_obj.product_id
            //         }
            //     };

            // axios(_obj)
            // 	  .then(async response => {
            //       }).catch({

            //       })
            // console.log("XXXXXXXXX==");
            // console.log(JSON.stringify(product_category_obj));
            // console.log("XXXXXXXXX==");
            addproductattributes(
              [product_category_obj.alias],
              product_obj.product_id
            );

            res.json(uploadskus);
          });
      });

    //  res.send(200, { submitted: true })
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.addvarient = async (req, res) => {
  try {
    const {
      productId,
      productPuritiesByProductId,
      productMetalcoloursByProductId,
      productDiamondTypes,
    } = req.body;
    let lastsku = await models.trans_sku_lists.findOne({
      attributes: ["sku_id"],
      where: {
        is_active: true,
      },
      order: [
        //  [ sequelize.cast(sequelize.col('sku_id'), 'BIGINT') , 'ASC' ]
        [sequelize.cast(sequelize.col("sku_id"), "BIGINT"), "DESC"],
      ],
    });
    var product_skus = [];
    var lastsku_id = parseInt(lastsku.sku_id);
    var skuprefix = productId + "-";
    let successmessage = await models.product_lists.findOne({
      include: [
        {
          model: models.product_purities,
          attributes: ["purity"],
        },
      ],
      where: {
        product_id: productId,
      },
    });
    let puritylist = [];
    if (successmessage) {
      let prod_purities = successmessage.product_purities;
      if (prod_purities) {
        prod_purities.forEach((pu_element) => {
          puritylist.push(pu_element.purity);
        });
      }
    }
    var purityarr = [];
    if (productPuritiesByProductId) {
      productPuritiesByProductId.forEach((pu_element) => {
        if (puritylist.indexOf(pu_element.purity) == -1) {
          puritylist.push(pu_element.purity);
          const purityobj = {
            id: uuidv1(),
            purity: pu_element.purity,
            product_id: productId,
            is_active: true,
          };
          purityarr.push(purityobj);
        }
      });
    }
    let prod_puritylist = await models.master_metals_purities.findAll({
      where: {
        name: {
          [Op.in]: puritylist,
        },
      },
    });

    prod_puritylist.forEach((purity) => {
      var sku = skuprefix + purity.short_code;
      var skuobj = {
        product_id: successmessage.product_id,
        product_type: successmessage.product_type,
        service_name: successmessage.vendor_code,
        purity: purity.name,
        generated_sku: sku,
      };
      product_skus.push(skuobj);
    });
    if (puritylist) {
      await models.product_purities.bulkCreate(purityarr, {
        individualHooks: true,
      });
    }

    var skus = product_skus;
    product_skus = [];
    var metal_color_arr = [];
    var prod_colurs = await models.product_metalcolours.findAll({
      where: {
        product_id: productId,
      },
    });
    let color_name = [];
    prod_colurs.forEach((colorobj) => {
      color_name.push(colorobj.product_color);
    });
    if (productMetalcoloursByProductId) {
      productMetalcoloursByProductId.forEach((metalcolorobj) => {
        if (color_name.indexOf(metalcolorobj.name) == -1) {
          const colorobj = {
            id: uuidv1(),
            product_color: metalcolorobj.name,
            product_id: productId,
            is_active: true,
          };
          metal_color_arr.push(colorobj);
        }
      });
      await models.product_metalcolours.bulkCreate(metal_color_arr, {
        individualHooks: true,
      });
    }

    var metalcolorlist = await models.master_metals_colors.findAll({
      where: {
        name: {
          [Op.in]: color_name,
        },
      },
    });
    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;

      metalcolorlist.forEach((metalcolor) => {
        var sku = skuval + metalcolor.short_code;

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          metal_color: metalcolor.name,
        };
        product_skus.push(skuobj);
      });
    });

    /*************** Diamond Lists ********************/
    var skus = product_skus;

    product_skus = [];
    var diamond_sku_clarity = {};
    let diamondtype = await models.master_diamond_types.findAll({});
    diamondtype.forEach((diamond_type) => {
      var claritytype =
        diamond_type.diamond_color + diamond_type.diamond_clarity;
      diamond_sku_clarity[claritytype] = diamond_type.short_code;
    });
    let new_diamonds = [];
    let existdiamonds = await models.product_diamonds.findAll({
      where: {
        product_sku: productId,
      },
    });
    let existdiamondtypes = [];
    existdiamonds.forEach((diamond_obj) => {
      existdiamondtypes.push(diamond_obj.diamond_type);
    });
    var existdiamondtype = "";
    if (productDiamondTypes) {
      productDiamondTypes.forEach((prod_diamond) => {
        if (existdiamondtypes.indexOf(prod_diamond.diamondType) == -1) {
          new_diamonds.push(prod_diamond);
        } else {
          existdiamondtype = prod_diamond.diamondType;
        }
      });
    }

    let diamondprops = await models.product_diamonds.findAll({
      where: {
        diamond_type: existdiamondtype,
        product_sku: productId,
      },
    });
    let newdiamondprops = [];
    new_diamonds.forEach((newdiamond_obj) => {
      diamondprops.forEach((olddiamond_obj) => {
        let diamondobj_props = {
          id: uuidv1(),
          ...olddiamond_obj,
          product_sku: productId,
          diamond_colour: newdiamond_obj.diamondColor,
          diamond_clarity: newdiamond_obj.diamondClarity,
          diamond_type: newdiamond_obj.diamondType,
          diamond_settings: olddiamond_obj.diamond_settings,
          diamond_shape: olddiamond_obj.diamond_shape,
          stone_count: olddiamond_obj.stone_count,
          stone_weight: olddiamond_obj.stone_weight,
        };
        newdiamondprops.push(diamondobj_props);
      });
    });
    // console.log("--------------------");
    // console.log(newdiamondprops);

    // console.log("--------------------");

    if (newdiamondprops) {
      await models.product_diamonds.bulkCreate(newdiamondprops, {
        individualHooks: true,
      });
    }
    skus.forEach((skuvalue) => {
      var skuval = skuvalue.generated_sku;

      productDiamondTypes.forEach((diamond) => {
        var clarity = diamond.diamondType;

        var sku = skuval + diamond_sku_clarity[clarity];

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,

          diamond_type: clarity,
        };
        product_skus.push(skuobj);
      });
    });

    skus = product_skus;
    var gemstonearr = [];
    var gemstonesku = "";
    var gemstonecolorcode1 = "00";
    var gemstonecolorcode2 = "00";
    var gemstoneshortcode = "00";
    var gemstonecolorcode2 = "00";

    let gem_arr = await models.product_gemstones.findAll({
      where: {
        product_sku: productId,
      },
    });
    let gem_content_arr = [];
    gem_arr.forEach((gemobj) => {
      gem_content_arr.push(gemobj.gemstone_type);
    });

    let gemstones = await models.master_gemstones_types.findAll({
      where: {
        name: {
          [Op.in]: gem_content_arr,
        },
      },
    });

    if (gemstones.length > 0) {
      var firstgemobj = gemstones[0];
      gemstoneshortcode = firstgemobj.short_ode;
      gemstonesku = firstgemobj.color_code;
      gemstonecolorcode1 = firstgemobj.color_code;
    }
    if (gemstones.length > 1) {
      var secondgemobj = gemstones[1];

      gemstonesku = gemstonesku + secondgemobj.color_ode;
      gemstonecolorcode2 = secondgemobj.color_code;
    }

    product_skus = [];
    skus.forEach((skuvalue) => {
      var sku =
        skuvalue.generated_sku + gemstonecolorcode1 + gemstonecolorcode2;

      var skuobj = {
        ...skuvalue,
        generated_sku: sku,
      };
      product_skus.push(skuobj);

      // product_skus.push(sku)
    });

    /*************** Size Lists ********************/

    skus = product_skus;
    product_skus = [];

    var sizelist = [];
    if (successmessage.size_varient) {
      sizelist = successmessage.size_varient.split(",");
    }
    // console.log(sizelist.length);
    skus.forEach((skuvalue) => {
      sizelist.forEach((sizevalue) => {
        var sku = skuvalue.generated_sku + "_" + sizevalue;

        var skuobj = {
          ...skuvalue,
          generated_sku: sku,
          sku_size: sizevalue,
        };
        product_skus.push(skuobj);
      });
    });
    if (product_skus.length == 0) {
      product_skus = skus;
    }

    let trans_skus = await models.trans_sku_lists.findAll({
      where: {
        product_id: productId,
      },
    });
    let existskus = [];
    trans_skus.forEach((skuid) => {
      existskus.push(skuid.generated_sku);
    });
    let newskus = [];
    // console.log("puritylistcount");

    product_skus.forEach((skuname) => {
      if (existskus.indexOf(skuname.generated_sku) == -1) {
        // console.log(skuname.generated_sku);
        let sku_val = {
          id: uuidv1(),
          ...skuname,
        };
        newskus.push(sku_val);
      }
    });
    // console.log(JSON.stringify(product_skus))
    // console.log(newskus.length);
    if (newskus.length > 0) {
      models.trans_sku_lists
        .bulkCreate(newskus, { individualHooks: true })
        .then(function (response) {
          res.json(response);
          // models.trans_sku_descriptions
          //   .bulkCreate(uploaddescriptions, { individualHooks: true })
          //   .then(function (response) {

          //     console.log("XXXXXXXXX==")
          //     console.log(JSON.stringify(product_category_obj))
          //     console.log("XXXXXXXXX==")
          //    // addproductattributes([product_category_obj.alias],product_obj.product_id)

          //     res.json(uploadskus);
          //   });
        });
    } else {
      res.json({ message: "success" });
    }
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.csvDownload = async (req, res) => {
  try {
    let { type } = req.body;
    if (!type || type == "" || type.includes("%")) {
      return res.status(400).send({ message: "type is mandatory!" });
    }

    let masterAttributes = Object.keys(await loadMasterAttributes()).filter(
      (i) => !["Category", "Product Type"].includes(i)
    );

    let query = `query($after: Cursor, $type: String!) {
      product: allProductLists(
        first: 10000
        after: $after
        condition: { isactive: true }
        filter: { productType: { likeInsensitive: $type } }
        orderBy: CREATED_AT_DESC
      ) {
        nodes {
          productId
          productName
          productCategory
          productType
          length
          height
          width
          defaultWeight
          sizeVarient
          colourVarient
          earringBacking
          gender
          vendor: masterVendorByVendorCode {
            name
          }
          productVendorCode
          isactive
          product_attributes: productAttributesByProductId {
            nodes {
              name: attributeName
              master: attributeMasterByMasterId {
                name
              }
            }
          }
          diamonds: productDiamondsByProductSku {
            nodes {
              diamondClarity
              diamondColour
              diamondSettings
              diamondShape
              diamondType
              stoneCount
              stoneWeight
            }
          }
          gemstones: productGemstonesByProductSku {
            nodes {
              gemstoneSetting
              gemstoneShape
              gemstoneSize
              gemstoneType
              gemstonsSize
              stoneCount
              stoneWeight
            }
          }
          skus: transSkuListsByProductId {
            nodes {
              tagNo: generatedSku
              diamondType
              metalColor
              purity
              isdefault
              isReadyToShip
              costPrice
              sellingPrice
              markupPrice
              discountPrice
              discount
              discountDesc
              skuWeight
              vendorDeliveryTime
              transSkuDescriptionsBySkuId {
                nodes {
                  skuDescription
                  certificate
                  ringsizeImage
                }
              }
              createdAt
              updatedAt
              minOrderQty
              maxOrderQty
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    `;
    let responseArrays = [];
    const axios = require("axios");
    function loadData({ cursor }) {
      axios
        .post("http://localhost:8000/graphql", {
          query,
          variables: { after: cursor, type },
        })
        .then(
          ({
            data: {
              data: {
                product: { nodes, pageInfo },
              },
            },
          }) => {
            if (nodes && nodes.length > 0) {
              for (let index = 0; index < nodes.length; index++) {
                let item = nodes[index];
                let diamonds = JSON.stringify(item.diamonds.nodes);
                let gemstones = JSON.stringify(item.gemstones.nodes);
                let { product_attributes } = item;
                let tempProductAttributes = product_attributes.nodes.reduce(
                  (pV, i) => {
                    if (
                      !pV[i.master.name] &&
                      !Array.isArray(pV[i.master.name])
                    ) {
                      pV[i.master.name] = [i.name];
                    } else {
                      pV[i.master.name].push(i.name);
                    }
                    return pV;
                  },
                  {}
                );
                let finalProductAttributes = {};
                for (const key of masterAttributes) {
                  finalProductAttributes[key] = tempProductAttributes[key]
                    ? tempProductAttributes[key]?.join(",")
                    : ``;
                }                
                for (let i = 0; i < item.skus.nodes.length; i++) {
                  const sku = item.skus.nodes[i];
                  if (sku) {
                    responseArrays.push({
                      name: item.productName,
                      product_id: item.productId,
                      tag_no: sku.tagNo,
                      categories: item.productCategory,
                      type: item.productType,
                      gender: item.gender,
                      purity: sku.purity,
                      weight: sku.skuWeight,
                      cost_price: sku.costPrice,
                      selling_price: sku.sellingPrice,
                      markup_price: sku.markupPrice,
                      discount_price: sku.discountPrice,
                      discount: sku.discount,
                      discount_description: sku.discountDesc,
                      vendor: item.vendor.name,
                      vendor_product_code: item.productVendorCode,
                      vendor_delivery_time: item.vendorDeliveryTime,
                      height: item.height,
                      width: item.width,
                      length: item.length,
                      created_at: moment(sku.created_at).format("DD-MM-YYYY"),
                      last_updated_at: moment(sku.updatedAt).format(
                        "DD-MM-YYYY"
                      ),
                      is_active: item.isactive,
                      is_ready_to_ship: sku.isReadyToShip,
                      is_default: sku.isdefault,
                      diamond_type: sku.diamondType,
                      metal_color: sku.metalColor,
                      // materials: item.materials.nodes
                      //   .map((i) => i.name)
                      //   .join(","),
                      // collections: item.collections.nodes
                      //   .map((i) => i.name)
                      //   .join(","),
                      // occasions: item.occasions.nodes
                      //   .map((i) => i.name)
                      //   .join(","),
                      // themes: item.themes.nodes.map((i) => i.name).join(","),
                      // styles: item.styles.nodes.map((i) => i.name).join(","),
                      // stone_color: item.stoneColor.nodes
                      //   .map((i) => i.color)
                      //   .join(","),
                      // stone_count: item.stoneCount.nodes
                      //   .map((i) => i.count)
                      //   .join(","),
                      ...finalProductAttributes,
                      diamonds,
                      gemstones,
                      minimum_order_quantity: sku.minOrderQty,
                      maximum_order_quantity: sku.maxOrderQty,
                      size_varient: item.sizeVarient,
                      color_varient: item.colourVarient,
                      earring_backing: item.earingBacking,
                    });
                  }
                }
              }
            }
            if (pageInfo.hasNextPage) {
              loadData({ cursor: pageInfo.endCursor });
            } else {
              return res.status(200).send(responseArrays);
            }
          }
        )
        .catch((error) => {
          console.error(error);
          res.status(500).send(error);
        });
    }
    loadData({ cursor: null });
  } catch (err) {
    console.log(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Calcutta",
      }) +
        " - Error message : " +
        err
    );
  }
};

exports.imageHoverUpdate = async (req, res) => {
  try {
    let { product_images } = req.body;
    for (let index = 0; index < product_images.length; index++) {
      const element = product_images[index];
      await models.product_images.update(element, {
        where: { id: element.id, product_id: element.product_id },
      });
    }
    res.status(200).send({ message: "Product images updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
