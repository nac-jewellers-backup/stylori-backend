const models = require("./../models");
const splitprice = require("./../controller/productMasters");

import "dotenv/config";
const Op = require("sequelize").Op;
const squelize = require("sequelize");
const uuidv1 = require("uuid/v1");
const sgMail = require("@sendgrid/mail");
var product_id_val = "";
sgMail.setApiKey(
  "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"
);
exports.splitdiamondpriceupdate = (req, res) => {
  try {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {};
    var responseobj = {};
    var pricesplitup = [];
    var products = [];
    var processed_product_count = 0;
    var processed_sku_count = 0;

    products = req.products;
    processproduct(processed_product_count);
    res.send(200, { message: "Update Successfully" });

    async function processproduct(processed_product_count) {
      var product_skus = [];
      if (products.length > processed_product_count) {
        let product_id = products[processed_product_count];
        let prod_trans = await splitprice.producttransskus(product_id);
        if (prod_trans) {
          product_skus = prod_trans.trans_sku_lists;
          if (product_skus.length > 0) {
            // console.log(JSON.stringify(prod_trans.product_id));
            diamondpricesetup(product_skus[processed_sku_count], prod_trans);
          } else {
          }
        }

        async function diamondpricesetup(skuobj, product_obj) {
          // console.log(JSON.stringify(product_obj));
          var diamondsetups = [];
          if (skuobj) {
            let sku_diamonds = await splitprice.skudiamond(
              product_obj.product_id,
              skuobj.diamond_type
            );
            var process_diamond_count = 0;
            processdiamond(process_diamond_count);
            var costprice_diamond = 0;
            var sellingprice_diamond = 0;
            async function processdiamond(process_diamond_count) {
              if (sku_diamonds.length > process_diamond_count) {
                let diamondobj = sku_diamonds[process_diamond_count];
                // console.log(JSON.stringify(product_obj));
                var conditionobj = {
                  vendor_code: product_obj.vendor_code,
                  diamond_colour: diamondobj.diamond_clarity,
                  diamond_clarity: diamondobj.diamond_colour,
                };

                let diamond_price_setup =
                  await models.diamond_price_settings.findOne({
                    where: conditionobj,
                  });

                if (diamond_price_setup) {
                  var diamondcost =
                    diamondobj.stone_weight * diamond_price_setup.cost_price;
                  var diamondsellingprice =
                    diamondobj.stone_weight * diamond_price_setup.selling_price;

                  costprice_diamond = costprice_diamond + diamondcost;
                  sellingprice_diamond =
                    sellingprice_diamond + diamondsellingprice;

                  var diamondmargin =
                    ((diamondsellingprice - diamondcost) / diamondcost) * 100;
                }

                var diamondprice = {
                  component:
                    "diamond" +
                    process_diamond_count +
                    "_" +
                    product_obj.product_id,
                  material_name:
                    diamondobj.diamond_clarity + "" + diamondobj.diamond_colour,
                  id: uuidv1(),
                  margin_percentage: diamondmargin,
                  cost_price: diamondcost,
                  selling_price: diamondsellingprice,
                  markup: diamondsellingprice,
                  discount_price: diamondsellingprice,
                  product_id: product_obj.product_id,
                  product_sku: skuobj.generated_sku,
                };

                let price_splitup_model =
                  await models.pricing_sku_materials.findOne({
                    where: {
                      product_sku: skuobj.generated_sku,
                      component: diamondprice.component,
                    },
                  });
                if (price_splitup_model) {
                  price_splitup_model
                    .update(diamondprice)
                    .then((result) => {
                      isdiamondexist();
                    })
                    .catch((reason) => {
                      isdiamondexist();
                    });
                } else {
                  models.pricing_sku_materials
                    .create(diamondprice)
                    .then((updatedmakingchargeprice) => {
                      isdiamondexist();
                    })
                    .catch((reason) => {
                      isdiamondexist();
                    });
                }
                function isdiamondexist() {
                  process_diamond_count = process_diamond_count + 1;
                  processdiamond(process_diamond_count);
                }
              } else {
                isskuexist();
              }
            }
          } else {
            isskuexist();
          }
        }
        function isskuexist() {
          processed_sku_count = processed_sku_count + 1;
          if (product_skus.length > processed_product_count) {
            diamondpricesetup(product_skus[processed_sku_count], prod_trans);
          } else {
            processed_product_count = processed_product_count + 1;
            processproduct(processed_product_count);
          }
        }
      } else {
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

exports.splitgoldpriceupdate = (req, res) => {
  try {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {};
    var responseobj = {};
    var pricesplitup = [];
    var products = [];
    var processed_product_count = 0;
    var processed_sku_count = 0;
    res.send(200, { message: "Update Successfully1" });

    products = req.products;
    processproduct(processed_product_count);
    async function processproduct(processed_product_count) {
      var product_skus = [];
      if (products.length > processed_product_count) {
        let product_id = products[processed_product_count];
        let prod_trans = await splitprice.producttransskus(product_id);
        // console.log(JSON.stringify(prod_trans));
        if (prod_trans) {
          product_skus = prod_trans.trans_sku_lists;
          if (product_skus.length > 0) {
            goldpricesetup(product_skus[processed_sku_count], prod_trans);
          } else {
            processed_product_count = processed_product_count + 1;
            processproduct(processed_product_count);
          }
        }

        async function goldpricesetup(skuobj, product_obj) {
          if (skuobj) {
            var purityval = skuobj.purity;
            let gold_price = await models.gold_price_settings.findOne({
              where: {
                vendor_code: product_obj.vendor_code,
                purity: parseInt(purityval.replace("K", "")),
              },
            });

            costprice = gold_price.cost_price * skuobj.sku_weight;
            if (gold_price.selling_price_type == 2) {
              sellingprice = calculatepercentage(
                costprice,
                gold_price.selling_price
              );
            } else {
              sellingprice = gold_price.selling_price * skuobj.sku_weight;
            }

            var goldmargin = ((sellingprice - costprice) / costprice) * 100;

            var goldprice = {
              material_name: "goldprice",
              cost_price: costprice,
              selling_price: sellingprice,
              markup: sellingprice,
              discount_price: sellingprice,
              margin_percentage: goldmargin,
              product_sku: skuobj.generated_sku,
              createdAt: new Date(),
              modifiedAt: new Date(),
            };
            pricesplitup.push(goldprice);

            models.pricing_sku_metals
              .findOne({
                where: {
                  product_sku: skuobj.generated_sku,
                  material_name: "goldprice",
                },
              })
              .then((price_splitup_model) => {
                if (price_splitup_model) {
                  price_splitup_model
                    .update(goldprice)
                    .then((updatedgoldprice) => {
                      isskuexist();
                    })
                    .catch((reason) => {
                      isskuexist();
                    });
                } else {
                  models.pricing_sku_metals
                    .create(goldprice)
                    .then((result) => {
                      isskuexist();
                    })
                    .catch((error) => {
                      isskuexist();
                    });
                }
              });
          } else {
            isskuexist();
          }
        }
        function isskuexist() {
          processed_sku_count = processed_sku_count + 1;
          if (product_skus.length > processed_product_count) {
            goldpricesetup(product_skus[processed_sku_count], prod_trans);
          } else {
            processed_product_count = processed_product_count + 1;
            processproduct(processed_product_count);
          }
        }
      } else {
        res.send(200, { message: "Update Successfully" });
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

exports.splitmakingchargeupdate = (req, res) => {
  try {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {};
    var responseobj = {};
    var pricesplitup = [];
    var products = [];
    var processed_product_count = 0;
    var processed_sku_count = 0;
    res.send(200, { message: "Update Successfully" });

    products = req.products;
    processproduct(processed_product_count);
    async function processproduct(processed_product_count) {
      var product_skus = [];
      if (products.length > processed_product_count) {
        let product_id = products[processed_product_count];
        let prod_trans = await splitprice.producttransskus(product_id);
        if (prod_trans) {
          product_skus = prod_trans.trans_sku_lists;
          if (product_skus.length > 0) {
            makingchargesetup(product_skus[processed_sku_count], prod_trans);
          } else {
            processed_product_count = processed_product_count + 1;
            processproduct(processed_product_count);
          }
        }

        async function makingchargesetup(skuobj, product_obj) {
          if (skuobj) {
            var mkcostprice = 0;
            var mksellingprice = 0;
            var purityval = skuobj.purity;
            let gold_price = await models.making_charge_settings.findAll({
              where: {
                vendor_code: vendorcode,
                purity: parseInt(purityval.replace("K", "")),
                material: "Gold",
                weight_start: {
                  [Op.lte]: productskus[skucount].sku_weight,
                },
                weight_end: {
                  [Op.gte]: productskus[skucount].sku_weight,
                },
              },
            });
            if (makingcharge) {
              makingcharge.forEach((makingcharge_obj) => {
                if (makingcharge_obj.price_type == 1) {
                  if (makingcharge_obj.rate_type == 1) {
                    mkcostprice = makingcharge_obj.price;
                  } else {
                    mkcostprice =
                      productskus[skucount].sku_weight * makingcharge_obj.price;
                  }
                }

                if (makingcharge_obj.price_type == 2) {
                  if (makingcharge_obj.rate_type == 1) {
                    if (makingcharge_obj.selling_price_type == 1) {
                      mksellingprice = makingcharge_obj.price;
                    } else if (makingcharge_obj.selling_price_type == 2) {
                      mksellingprice = calculatepercentage(
                        costprice,
                        makingcharge_obj.price
                      );
                    }
                  } else if (makingcharge_obj.rate_type == 2) {
                    if (makingcharge_obj.rate_type == 1) {
                      mksellingprice = makingcharge_obj.price;
                    } else {
                      mksellingprice =
                        productskus[skucount].sku_weight *
                        makingcharge_obj.price;
                    }
                  }
                }
              });
              var makingmargin =
                ((mksellingprice - mkcostprice) / mkcostprice) * 100;

              var makingprice = {
                material_name: "makingcharge",
                cost_price: mkcostprice,
                selling_price: mksellingprice,
                markup: mksellingprice,
                discount_price: mksellingprice,
                margin_percentage: makingmargin,
                product_sku: skuobj.generated_sku,
              };
              models.pricing_sku_metals
                .findOne({
                  where: {
                    product_sku: skuobj.generated_sku,
                    material_name: "makingcharge",
                  },
                })
                .then((price_splitup_model) => {
                  if (price_splitup_model) {
                    price_splitup_model
                      .update(makingprice)
                      .then(async (updatedmakingchargeprice) => {
                        isskuexist();
                      })
                      .catch((reason) => {
                        //  res.send(200,{"message":reason.message,price_splitup_model});

                        isskuexist();
                      });
                  } else {
                    models.pricing_sku_metals
                      .create(makingprice)
                      .then(async (result) => {
                        // gemstonesell = calculatesellingmarkup(gemstonemarkup, gemstonesell)
                        isskuexist();
                      })
                      .catch((error) => {
                        isskuexist();
                      });
                  }
                });
            } else {
              isskuexist();
            }

            function isskuexist() {
              processed_sku_count = processed_sku_count + 1;
              if (product_skus.length > processed_product_count) {
                diamondpricesetup(product_skus[processed_sku_count]);
              } else {
                const msg = {
                  to: "manokarantk@gmail.com",
                  subject: "Pricing update started",
                  from: "info@ustimeapp.com",
                  html: "<b>started</>",
                };
                sgMail.send(msg);
                processed_product_count = processed_product_count + 1;
                processproduct(processed_product_count);
              }
            }
          } else {
            processed_product_count = processed_product_count + 1;
            processproduct(processed_product_count);
          }
        }
      } else {
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

exports.splitgemstonepriceupdate = (req, res) => {
  try {
    var costprice = 0;
    var sellingprice = 0;
    var product_obj = {};
    var responseobj = {};
    var pricesplitup = [];
    var products = [];
    var processed_product_count = 0;
    var processed_sku_count = 0;

    products = req.products;
    processproduct(processed_product_count);
    res.send(200, { message: "Update Successfully" });

    async function processproduct(processed_product_count) {
      var product_skus = [];
      var gemstone_component_count = 0;

      if (products.length > processed_product_count) {
        let product_id = products[processed_product_count];
        let prod_trans = await splitprice.producttransskus(product_id);
        if (prod_trans) {
          product_skus = prod_trans.trans_sku_lists;
          if (product_skus.length > 0) {
            // console.log(JSON.stringify(prod_trans.product_id));
            gemstonepricesetup(product_skus[processed_sku_count], prod_trans);
          } else {
          }
        }

        async function gemstonepricesetup(skuobj, product_obj) {
          var gemstonesetups = [];
          var gemstone_count = 0;

          if (skuobj) {
            let sku_gemstones = await splitprice.skugemstone(
              product_obj.product_id
            );
            gemstone_component_count = sku_gemstones.length;
            // console.log("gemstonsesval");
            // console.log(sku_gemstones.length);
            if (sku_gemstones.length > 0) {
              // console.log("gemstone");

              gemstone_component_count++;
              gemstone_process(sku_gemstones[0], product_obj.vendor_code);
            } else {
              isskuexist();
            }

            function gemstone_process(gemstoneobj, vendorcode) {
              var whereclause = {
                vendor_code: vendorcode,
                gemstone_type: {
                  [Op.iLike]: gemstoneobj.gemstone_type,
                },
              };

              if (gemstoneobj.stone_weight) {
                var stoneweight =
                  gemstoneobj.stone_weight / gemstoneobj.stone_count;
                whereclause["weight_start"] = { [Op.lte]: stoneweight };
                whereclause["weight_end"] = { [Op.gte]: stoneweight };
              } else {
                whereclause["rate_type"] = 2;
              }
              // console.log(JSON.stringify(whereclause));
              // console.log(JSON.stringify(gemstoneobj.gemstone_type));
              // console.log(JSON.stringify(stoneweight));

              models.gemstone_price_settings
                .findAll({
                  where: whereclause,
                })
                .then(async (gemstonecharge) => {
                  var gemstonemargin = 0;
                  var gemstonecost = 0;
                  var gemstonesell = 0;
                  var cost_price_type = 0;
                  var sell_price_type = 0;
                  var sell_percent_flat = 0;

                  gemstonecharge.forEach((pricingobj) => {
                    if (pricingobj.price_type == 1) {
                      gemstonecost = pricingobj.price;
                      cost_price_type = pricingobj.rate_type;
                    } else if (pricingobj.price_type == 2) {
                      gemstonesell = pricingobj.price;
                      sell_price_type = pricingobj.rate_type;
                      sell_percent_flat = pricingobj.selling_price_type;
                    }
                  });

                  if (cost_price_type == 1) {
                    if (gemstoneobj.stone_weight) {
                      gemstonecost = gemstonecost * gemstoneobj.stone_weight;
                    } else {
                      gemstonecost = gemstonecost * gemstoneobj.stone_count;
                    }
                  } else {
                  }
                  if (sell_price_type == 1) {
                    if (sell_percent_flat == 2) {
                      gemstonesell = calculatepercentage(
                        gemstonecost,
                        gemstonesell
                      );
                    } else {
                      gemstonesell = gemstoneobj.stone_weight * gemstonesell;
                    }
                  } else if (sell_price_type == 2) {
                    if (gemstoneobj.stone_count) {
                      gemstonesell = gemstoneobj.stone_count * gemstonesell;
                    }
                  }

                  var gemstone_whereclause = {
                    material_name: "gemstone",
                  };
                  gemstone_whereclause["price_min"] = {
                    [Op.lte]: gemstonesell,
                  };
                  gemstone_whereclause["price_max"] = {
                    [Op.gte]: gemstonesell,
                  };

                  let gemstone_markup = await models.material_markups.findOne({
                    where: gemstone_whereclause,
                  });
                  if (gemstone_markup) {
                    if (gemstone_markup.markup_type == 1) {
                      gemstonesell = gemstone_markup.markup_value;
                    }
                  }
                  gemstonemargin =
                    ((gemstonesell - gemstonecost) / gemstonecost) * 100;

                  gemstone_count++;

                  pricesplitup.push(gemstoneobj);

                  var gemstoneprice = {
                    component: "gemstone" + gemstone_count,
                    material_name: gemstoneobj.gemstone_type,
                    id: uuidv1(),
                    margin_percentage: gemstonemargin,
                    cost_price: gemstonecost,
                    selling_price: gemstonesell,
                    markup: gemstonesell,
                    discount_price: gemstonesell,
                    product_sku: productskus[skucount].generated_sku,
                    product_id: product_obj.product_id,
                  };
                  models.pricing_sku_materials
                    .findOne({
                      where: {
                        product_sku: productskus[skucount].generated_sku,
                        material_name: gemstoneprice.material_name,
                      },
                    })
                    .then((price_splitup_model) => {
                      if (price_splitup_model) {
                        var gemstonemargin1 =
                          ((gemstonesell +
                            price_splitup_model.markup -
                            gemstonecost) /
                            gemstonecost) *
                          100;
                        gemstoneprice["margin_percentage"] = gemstonemargin1;
                        price_splitup_model
                          .update(gemstoneprice)
                          .then((updatedmakingchargeprice) => {
                            isgemstoneexist();
                          })
                          .catch((reason) => {
                            isgemstoneexist();
                          });
                      } else {
                        models.pricing_sku_materials
                          .create(gemstoneprice)
                          .then((result) => {
                            isgemstoneexist();
                          })
                          .catch((error) => {
                            isgemstoneexist();
                          });
                      }
                    });
                });
              function isgemstoneexist() {
                if (product_gemstones.length > gemstone_count) {
                  gemstone_process(
                    product_gemstones[gemstone_count],
                    product_obj.vendor_code
                  );
                } else {
                  updategoldprice(product_obj.vendor_code, productsku);
                }
              }
            }
          }
        }
        function isskuexist() {
          processed_sku_count = processed_sku_count + 1;
          if (product_skus.length > processed_product_count) {
            gemstonepricesetup(product_skus[processed_sku_count], prod_trans);
          } else {
            processed_product_count = processed_product_count + 1;
            processproduct(processed_product_count);
          }
        }
      } else {
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
