const jwt = require("jsonwebtoken");
import "dotenv/config";
const models = require("./../models");
const Op = require("sequelize").Op;

const productList = (req, res, next) => {
  try {
    const { req_product_id } = req.body;
    var whereclause1 = {};
    if (req_product_id) {
      var product_id_arr1 = req_product_id.split(",");
      whereclause1 = {
        product_id: {
          [Op.in]: product_id_arr1,
        },
      };
    }

    models.product_lists
      .findAll({
        attributes: ["product_id", "vendor_code"],
        where: whereclause1,
      })
      .then((product) => {
        req.products = product;
        next();
      });
  } catch (err) {
    console.log(
      "Error at " +
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
        " message : " +
        err
    );
  }
};

const producttransskus = async (productinfo, req, res, next) => {
  try {
    var whereclause1 = {};

    whereclause1 = {
      product_id: productinfo.product_id,
    };
    let prod_skus = await models.product_lists.findOne({
      attributes: ["product_id", "vendor_code"],
      include: [
        {
          model: models.trans_sku_lists,
        },
      ],
      where: whereclause1,
    });
    return prod_skus;
  } catch (err) {
    console.log(
      "Error at " +
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
        " message : " +
        err
    );
  }
};

const skugemstone = async (product_id, req, res, next) => {
  try {
    var whereclause1 = {};

    whereclause1 = {
      product_sku: product_id,
    };
    let prod_sku_gemstones = await models.product_gemstones.findAll({
      where: whereclause1,
    });
    return prod_sku_gemstones;
  } catch (err) {
    console.log(
      "Error at " +
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
        " message : " +
        err
    );
  }
};
const skudiamond = async (product_id, diamondtype, req, res, next) => {
  try {
    var whereclause1 = {};

    whereclause1 = {
      diamond_type: diamondtype,
      product_sku: product_id,
    };
    let prod_sku_diamonds = await models.product_diamonds.findAll({
      where: whereclause1,
    });
    return prod_sku_diamonds;
  } catch (err) {
    console.log(
      "Error at " +
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
        " message : " +
        err
    );
  }
};

const productPricing = {};
productPricing.productList = productList;
productPricing.producttransskus = producttransskus;
productPricing.skudiamond = skudiamond;
productPricing.skugemstone = skugemstone;

module.exports = productPricing;
