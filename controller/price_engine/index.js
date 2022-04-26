import {
  priceUpdate,
  finalPriceRun,
  createPriceRunHistory,
  updatePriceRunHistory,
} from "./markup_and_discount";
const models = require("../../models");
const calculateDiamondPrice = require("./run_diamond_price");
const calculateGemstonePrice = require("./run_gemstone_price");
const calculateGoldPrice = require("./run_gold_price");
const calculateMakingCharge = require("./run_making_charge");

let price_run_types = {
  gold: calculateGoldPrice,
  making_charge: calculateMakingCharge,
  "diamond&gemstone": [calculateDiamondPrice, calculateGemstonePrice],
  diamond: calculateDiamondPrice,
  gemstone: calculateGemstonePrice,
};

const componentPriceEngine = ({ product_id, type }) => {
  return new Promise((resolve, reject) => {
    models.product_lists
      .findOne({
        include: { model: models.trans_sku_lists },
        where: { product_id },
      })
      .then(async (product) => {
        let response = {};

        let diamond_price_details = await price_run_types["diamond"]({
          product_id,
          vendor_code: product.vendor_code,
        });
        let gemstone_price_details = await price_run_types["gemstone"]({
          product_id,
          vendor_code: product.vendor_code,
        });

        for (let index = 0; index < product.trans_sku_lists.length; index++) {
          const sku = product.trans_sku_lists[index];
          response[sku.generated_sku] = {};

          if (type.includes("diamond")) {
            response[sku.generated_sku] = {
              ...response[sku.generated_sku],
              diamond: diamond_price_details?.diamonds,
            };
          }
          if (type.includes("gemstone")) {
            response[sku.generated_sku] = {
              ...response[sku.generated_sku],
              gemstone: gemstone_price_details?.gemstones,
            };
          }
          if (type == "gold") {
            response[sku.generated_sku] = {
              ...response[sku.generated_sku],
              gold: await price_run_types[type]({
                product_id,
                sku,
                vendor_code: product.vendor_code,
              }),
            };
          }
          if (type == "making_charge") {
            response[sku.generated_sku] = {
              ...response[sku.generated_sku],
              making_charge: (
                await price_run_types[type]({
                  product_id,
                  sku,
                  vendor_code: product.vendor_code,
                })
              )?.making_charge,
            };
          }
        }

        let processTypes = [];
        if (type == "gold" || type == "making_charge") {
          processTypes.push("pricing_sku_metals");
        } else if (type.includes("diamond") || type.includes("gemstone")) {
          processTypes.push("pricing_sku_materials");
          await Promise.all(
            Object.keys(response).map(async (sku) => {
              return await models.temp_price_list.upsert({
                product_id,
                generated_sku: sku,
                pricing: {
                  pricing_sku_materials: [
                    ...response[sku].diamond,
                    ...response[sku].gemstone,
                  ],
                },
              });
            })
          );
        }
        resolve(response);
      })
      .catch(reject);
  });
};

const componentFinalPriceRun = (processTypes) => {
  let defaultColumns = [
    { columnName: "selling_price", columnType: "numeric" },
    { columnName: "markup_price", columnType: "numeric" },
    { columnName: "discount_price", columnType: "numeric" },
  ];
  let jsonToRecordSetMapper = {
    total_no_stones: {
      modelName: "total_no_stones",
      columns: [{ columnName: "type", columnType: "text" }, ...defaultColumns],
    },
    pricing_sku_materials: {
      modelName: "pricing_sku_materials",
      columns: [
        { columnName: "component", columnType: "text" },
        ...defaultColumns,
      ],
    },
    pricing_sku_metals: {
      modelName: "pricing_sku_metals",
      columns: [
        { columnName: "material_name", columnType: "text" },
        ...defaultColumns,
      ],
    },
  };
  return new Promise((resolve, reject) => {
    Promise.all(
      Object.keys(jsonToRecordSetMapper).map(async (item) => {
        if (processTypes.includes(item)) {
          let { modelName, columns } = jsonToRecordSetMapper[item];
          return await models.sequelize.query(`update ${modelName} t set
          selling_price = subquery.selling_price,
          ${
            modelName == "total_no_stones" ? "markup_price" : "markup"
          } = subquery.markup_price,
          discount_price =subquery.discount_price,
          margin_percentage = case when subquery.markup_price > 0 
                    then((subquery.discount_price - subquery.markup_price)*100/subquery.markup_price) 
                    else 0 
                    end, 
          "updatedAt" = now()
          from 
          (
            select t.product_id,t.generated_sku,x.*,t."updatedAt" from 
            temp_price_lists t,
            json_to_recordset(pricing#>'{${item}}') as 
            x(${columns
              .map((i) => `${i.columnName} ${i.columnType}`)
              .join(",")})   
          ) as subquery
          where t.product_sku = subquery.generated_sku and t.${
            columns[0].columnName
          } = subquery.${columns[0].columnName}`);
        } else {
          return Promise.resolve(true);
        }
      })
    )
      .then(resolve)
      .catch(reject);
  });
};

module.exports = {
  componentPriceEngine,
  componentFinalPriceRun,
  priceUpdate,
  finalPriceRun,
  createPriceRunHistory,
  updatePriceRunHistory,
};
