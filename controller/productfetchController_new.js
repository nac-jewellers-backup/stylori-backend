const models = require("../models");
import "dotenv/config";
const Op = require("sequelize").Op;
const sequelize = require("sequelize");
import { sendMail } from "./notify/user_notify";
import apidata from "./apidata.json";
import { getFilteredProductIds } from "./filtercontroller";
const uuidv1 = require("uuid/v1");
var splitArray = require("split-array");

exports.filteroptions_new = async (req, res) => {
  let {
    sortBy,
    offer_max,
    offer_min,
    offset,
    price,
    availability,
    ...filters
  } = req.body;

  let baseCondition = {};

  let imageCondition = {
    isdefault: true,
    image_position: {
      [Op.in]: [1, 2],
    },
  };

  let skuSortOrder = [];

  let skuCondition = {
    isdefault: true,
  };

  let productListCondition = {
    isactive: true,
  };

  if (filters?.category == "goldcoins") {
    filters["category"] = "Gold Coins";
  }

  // let filterArray = Object.keys(filters)
  //   .filter(
  //     (i) =>
  //       ![
  //         "isJewellery",
  //         "availability",
  //         "offer_min",
  //         "offer_max",
  //         "price",
  //         "sortBy",
  //         "offset",
  //         "filters",
  //       ].includes(i)
  //   )
  //   .map((i) => filters[i]);

  if (filters.isJewellery) {
    // filterArray = [...filterArray, "Jewellery"];
    // baseCondition = {
    //   ...baseCondition,
    //   attribute_name: { [Op.ne]: "92.5" },
    // };
    // skuCondition = {
    //   ...skuCondition,
    //   purity: { [Op.ne]: "92.5" },
    // };
  }

  if (filters.metalcolor) {
    let metalcolor = filters.metalcolor;
    imageCondition = {
      ...imageCondition,
      product_color: metalcolor,
    };
    skuCondition["metal_color"] = {
      [Op.eq]: metalcolor,
    };
    product_includes.push({
      model: models.product_metalcolours,
    });
  }

  let orderBy = [];

  if (sortBy) {
    switch (sortBy) {
      case "Featured":
        orderBy.push(["is_featured", "ASC"]);
        break;
      case "New to Stylori":
        orderBy.push(["is_featured", "ASC"]);
        break;
      case "Ready to Ship":
        orderBy.push([
          { model: models.trans_sku_lists },
          "is_ready_to_ship",
          "desc",
        ]);
        break;
      case "Price High to Low":
        orderBy.push([
          { model: models.trans_sku_lists },
          "markup_price",
          "desc",
        ]);
        break;
      case "Price Low to High":
        orderBy.push([
          { model: models.trans_sku_lists },
          "markup_price",
          "asc",
        ]);
        break;
      case "Best Seller":
        orderBy.push(["selling_qty", "ASC"]);
        break;
      default:
        break;
    }
  }

  if (offer_min && offer_max) {
    skuCondition["discount"] = {
      [Op.between]: [offer_min, offer_max],
    };
  } else {
    if (offer_min) {
      skuCondition["discount"] = {
        [Op.gte]: offer_min,
      };
    } else if (offer_max) {
      skuCondition["discount"] = {
        [Op.lte]: offer_max,
      };
    }
  }

  if (price) {
    if (price.min_price && price.max_price) {
      // delete skuCondition["isdefault"];
      skuCondition["markup_price"] = {
        [Op.between]: [price.min_price, price.max_price],
      };
    } else {
      if (price.max_price) {
        skuCondition["markup_price"] = {
          [Op.lte]: price.max_price,
        };
      }
    }
  }

  if (availability) {
    delete skuCondition["isdefault"];
    if (availability === "1 Day Shipping") {
      skuSortOrder.push(["is_ready_to_ship", "DESC"]);
      skuCondition = {
        ...skuCondition,
        is_ready_to_ship: true,
        is_active: true,
      };
    } else if (availability === "10 & Above Days Shipping") {
      skuCondition = {
        ...skuCondition,
        is_ready_to_ship: false,
        is_active: true,
        vendor_delivery_time: { [Op.gt]: 10 },
      };
    } else if (availability === "Out of Stock") {
      skuCondition["generated_sku"] = {
        [Op.notIn]: models.sequelize.literal(
          "(select generated_sku from inventories where number_of_items > 0)"
        ),
      };
    } else {
      skuCondition = {
        ...skuCondition,
        is_ready_to_ship: false,
        vendor_delivery_time: {
          [Op.eq]: availability,
        },
      };
    }
  }

  let product_includes = [
    {
      model: models.product_diamonds,
      as: "productDiamondsByProductSku",
      attributes: [
        ["diamond_clarity", "diamondClarity"],
        ["diamond_colour", "diamondColour"],
        ["diamond_type", "diamondType"],
        ["stone_weight", "stoneWeight"],
        ["diamond_shape", "diamond_Shape"],
        ["diamond_settings", "diamond_Settings"],
        ["stone_count", "stone_Count"],
      ],
      required: false,
    },
    {
      model: models.product_images,
      as: "productImagesByProductId",
      attributes: [
        ["ishover", "ishover"],
        ["image_url", "imageUrl"],
        ["image_position", "imagePosition"],
        ["isdefault", "isdefault"],
      ],
      where: imageCondition,
      required: false,
    },
  ];

  if (filters?.material == "Silver") {
    // filterArray = [...filterArray, "92.5"];
    skuCondition = {
      ...skuCondition,
      purity: { [Op.eq]: "92.5" },
    };
  }

  //including trans_sku_lists
  product_includes.push({
    model: models.trans_sku_lists,
    attributes: [
      ["sku_size", "skuSize"],
      "purity",
      ["diamond_type", "diamondType"],
      ["markup_price", "markupPrice"],
      ["markup_price", "markupPrice"],
      ["sku_id", "skuID"],
      ["sku_url", "skuUrl"],
      ["selling_price", "sellingPrice"],
      ["discount_price", "discountPrice"],
      ["discount", "discount"],
      ["generated_sku", "generatedSku"],
      ["is_ready_to_ship", "isReadyToShip"],
      ["vendor_delivery_time", "vendorDeliveryTime"],
    ],
    where: skuCondition,
    required: true,
    order: skuSortOrder,
  });
  try {
    let product_ids = await getFilteredProductIds(filters);    
    let { count, rows } = await models.product_lists.findAndCountAll({
      attributes: [
        ["product_name", "productName"],
        ["product_id", "productId"],
        ["product_type", "productType"],
        ["default_size", "defaultSize"],
        ["size_varient", "sizeVarient"],
        ["product_type", "productType"],
        "is_featured",
        "selling_qty",
      ],
      include: product_includes,
      limit: 24,
      offset: offset,
      distinct: "product_id",
      where: {
        product_id: {
          [Op.in]: product_ids,
        },
        ...productListCondition,
      },
      order: orderBy,      
    });
    res
      .status(200)
      .send({ data: { totalCount: count, allProductLists: rows } });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
