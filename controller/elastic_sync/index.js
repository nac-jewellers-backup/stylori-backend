import { fullIndexSync } from "./dbsync_with_es";

const models = require("./../../models");

const { Op } = models.Sequelize;

const fetchSeoURLPriorities = async ({ condition }) => {
  return await models.seo_url_priorities.findAll({ where: condition });
};

const fetchESRecordsFromDB = ({
  product_ids,
  fetchProducts = true,
  fetchSkus = true,
  fetchSeos = true,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let condition = {
        is_active: true,
      };
      if (product_ids && product_ids.length) {
        condition["product_id"] = { [Op.in]: product_ids };
      }
      let sku_list = [],
        product_list = [],
        seo_list = [];
      if (fetchSkus) {
        sku_list = await models.trans_sku_lists.findAll({
          attributes: ["id", "generated_sku", "sku_url"],
          where: condition,
        });
      }
      if (fetchProducts) {
        condition["isactive"] = condition.is_active;
        delete condition.is_active;
        product_list = await models.product_lists.findAll({
          attributes: ["id", "product_name"],
          include: [
            {
              model: models.trans_sku_lists,
              attributes: ["sku_url"],
              where: {
                isdefault: true,
              },
            },
          ],
          where: condition,
        });
      }
      if (fetchSeos) {
        let seoProductTypes = await fetchSeoURLPriorities({
          condition: { attribute_name: "Product Type" },
        });
        let jewelCategorySeo = await fetchSeoURLPriorities({
          condition: {
            attribute_value: {
              [Op.eq]: "Jewellery",
            },
          },
        });
        if (jewelCategorySeo && jewelCategorySeo.length) {
          jewelCategorySeo = jewelCategorySeo[0];
        }

        for (let index = 0; index < seoProductTypes.length; index++) {
          const productTypes = seoProductTypes[index];
          let productBasedSeoList = await models.seo_url_priorities.findAll({
            attributes: ["id", "attribute_value", "seo_url", "priority"],
            where: {
              attribute_value: {
                [Op.in]: models.sequelize
                  .literal(`(SELECT attribute_name from product_attributes 
                              where product_id in (select product_id from product_lists
                                                   where product_type = '${productTypes.attribute_value}'))`),
              },
            },
          });
          for (let index = 0; index < productBasedSeoList.length; index++) {
            const element = productBasedSeoList[index];
            let temp = [productTypes, element, jewelCategorySeo].sort(
              (a, b) => {
                return a.priority > b.priority;
              }
            );
            seo_list.push({
              id: element.id,
              seo_url: temp.map((i) => i.seo_url).join("-"),
              seo_text: temp.map((i) => i.attribute_value).join(" "),
            });
          }
        }
      }
      resolve({ product_list, sku_list, seo_list });
    } catch (error) {
      reject(error);
    }
  });
};

export { fetchESRecordsFromDB, fullIndexSync };
