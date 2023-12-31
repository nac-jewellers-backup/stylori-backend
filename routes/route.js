const authJwt = require("./verifyJwtToken");
const axios = require("axios");
const BASE_URL = "http://localhost:8000";
const productPricing = require("../controller/productMasters");
const uuidv4 = require("uuid/v4");
var arrayChunk = require("array-chunk");
let {
  esSearch,
  docBulk,
  deleteIndex,
  initMapping,
  initIndex,
  indexDocumentsCount,
} = require("../controller/elasticServices");
const { send_sms } = require("../controller/notify/user_notify");
const price_engine = require("../controller/price_engine");
const {
  fetchESRecordsFromDB,
  fullIndexSync,
} = require("../controller/elastic_sync");
const {
  upsertComboOffers,
  displayComboOffer,
  checkCartAndApplyCombo,
} = require("../controller/combo_offers");
const turl = process.env.apibaseurl + "/productesearch";
const upload = require("../middlewares/multer").single("file");
let ES_INDEXS = ["product_search", "sku_search", "seo_search"];

module.exports = function (app) {
  const configurationcontroller = require("../controller/master_configuration.js");

  const authcontroller = require("../controller/authcontroller.js");
  const productcontroller = require("../controller/productcontroller.js");
  const pricingontroller = require("../controller/pricingcontroller.js");
  const productupdatecontroller = require("../controller/productupdatecontroller.js");
  const discountcontroller = require("../controller/checkdiscount.js");
  const updatesizecontroller = require("../controller/product_size_update_controller.js");
  const cartcontroller = require("../controller/cartcontroller.js");
  const filtercontroller = require("../controller/filtercontroller.js");
  const master_uploaddata_controller = require("../controller/master_uploaddata_controller.js");
  const pricesplitup_controller = require("../controller/pricesplitupcontroller.js");
  const single_product_pricecontroller = require("../controller/pricingcontroller_whole.js");
  const component_price_update = require("../controller/priceupdateController.js");
  const productfetchController_esearch = require("../controller/productfetchController_esearch.js");

  const productFetchController = require("../controller/productfetchController.js");

  const inventoryController = require("../controller/inventorycontroller");

  app.post("/componentpriceupdate", component_price_update.priceupdate);

  app.post("/api/auth/signin", authcontroller.signin);
  app.post(
    "/verifypasswordtoken",
    [authJwt.verifyToken],
    authcontroller.verifypasswordtoken
  );
  app.post(
    "/changepassword",
    [authJwt.verifyToken],
    authcontroller.changepassword
  );

  app.post(
    "/esearchcombination",
    productfetchController_esearch.esearchcombination
  );

  app.post("/fbsignin", authcontroller.fbsignin);
  app.post("/fbsignup", authcontroller.fbsignup);

  app.post("/api/auth/signup", authcontroller.signup);
  app.post("/verification/:email/:token", authcontroller.verification);
  app.post("/forgotpassword", authcontroller.forgotpassword);
  app.post(
    "/resetpassword",
    [authJwt.verifyToken],
    authcontroller.resetpassword
  );

  app.post("/ringpriceupdate", productcontroller.ringpriceupdate);
  app.post("/addvarient", productcontroller.addvarient);
  app.post("/productupload", productcontroller.productupload2);
  app.post("/productupdate", productupdatecontroller.updateproduct);
  app.post("/priceupdate", productcontroller.priceupdate);
  app.post("/disableproduct", productcontroller.disableproduct);
  app.post("/getproductlist", productcontroller.getproductlist);
  app.post("/getorders", productcontroller.getorderlist);
  app.post("/getorderdetails", productcontroller.getorderdetails);

  app.post("/productpriceupdate", single_product_pricecontroller.priceupdate);

  app.post(
    "/splitdiamondpriceupdate",
    [productPricing.productList],
    pricesplitup_controller.splitdiamondpriceupdate
  );
  app.post(
    "/splitgoldpriceupdate",
    [productPricing.productList],
    pricesplitup_controller.splitgoldpriceupdate
  );
  app.post(
    "/splitmarkuppriceupdate",
    [productPricing.productList],
    pricesplitup_controller.splitmakingchargeupdate
  );
  app.post(
    "/splitgemstonepriceupdate",
    [productPricing.productList],
    pricesplitup_controller.splitgemstonepriceupdate
  );
  app.post("/generatepaymenturl", cartcontroller.generatepaymenturl);
  app.post("/paymentsuccess", cartcontroller.paymentsuccess);
  app.post("/paymentfailure", cartcontroller.paymentfailure);
  app.post("/paymentipn", cartcontroller.payment_ipn_callback);

  app.post("/updateattributes", productupdatecontroller.updateattributes);

  app.post(
    "/getpriceupdatestatus",
    productupdatecontroller.getpriceupdatestatus
  );

  app.post(
    "/api/updateuserprofile",
    [authJwt.verifyToken],
    authcontroller.updateuserprofile
  );
  app.get(
    "/api/userprofile",
    [authJwt.verifyToken],
    authcontroller.userContent
  );
  app.post("/updatepricelist", pricingontroller.priceupdate);
  app.post("/checkdiscount", discountcontroller.checkdiscount);
  app.post("/updatesize", updatesizecontroller.updatesize);
  app.post("/api/auth/guestlogin", authcontroller.guestlogin);
  app.post("/api/auth/verifyotp", authcontroller.verifyotp);

  app.post("/updatevendorgoldprice", pricingontroller.updatevendorgoldprice);

  app.post("/updatemetalprice", pricingontroller.updatemetalprice);
  app.post("/updatediamondprice", pricingontroller.updatediamondprice);
  app.post("/updategemstoneprice", pricingontroller.updategemstoneprice);
  app.post("/updatemakingcharge", pricingontroller.updatemakingcharge);
  app.post("/getvendorgemprice", pricingontroller.vendorgemprice);
  app.post("/getvendormakingprice", pricingontroller.vendormakingprice);
  app.post("/getdistinctproduct", pricingontroller.getdistinctproduct);
  app.get("/getlogfile", pricingontroller.logfile);
  app.post("/getcomponentpricestatus", pricingontroller.priceupdatestatus);
  app.post("/getaliasproduct", pricingontroller.getaliasproductlist);
  app.post("/creatediscount", pricingontroller.creatediscount);
  app.post("/checksalediscount", pricingontroller.checkdiscount);
  app.post("/getdiscount", pricingontroller.discountinfo);
  app.post("/getincompletepricerun", pricingontroller.getincompletepricerun);

  app.post("/updatemarkup", pricingontroller.updatemarkup);
  app.post("/addmarkup", pricingontroller.addmarkup);

  app.post("/api/auth/verifyotp", authcontroller.verifyotp);
  app.post("/addquestion", authcontroller.addquestion);
  app.post("/addemailsubscription", authcontroller.addemailsubscription);
  app.post("/asktoexport", authcontroller.asktoexport);
  app.post("/getmasterroles", authcontroller.getmasterroles);
  app.post("/updateuser", authcontroller.updateUser);
  app.post("/getadminusers", authcontroller.getadminusers);
  app.post(
    "/getpageaccess",
    [authJwt.verifyToken],
    authcontroller.getpageaccess
  );

  app.post("/addwishlist", cartcontroller.addwishlist);
  app.post("/removewishlist", cartcontroller.removewishlist);
  app.post("/removeaddress", cartcontroller.removeaddress);
  app.post("/testorderconformation", cartcontroller.testorderemail);

  app.post("/productesearch", productfetchController_esearch.productesearch);

  app.post("/createorder", cartcontroller.addorder);
  app.post("/updatecartitem", cartcontroller.updatecartitem);

  app.post("/addproductreview", cartcontroller.addproductreview);
  app.post("/applyvoucher", cartcontroller.applyvoucher);
  app.post("/createvoucher", cartcontroller.createvoucher);
  app.post("/getvoucher", cartcontroller.getvoucher);

  app.post("/addgiftwrap", cartcontroller.addgiftwrap);
  app.post("/addtocart", cartcontroller.addtocart);
  app.post("/updatecart_latestprice", cartcontroller.updatecart_latestprice);
  app.post("/addaddress", cartcontroller.addaddress);
  app.post("/adduseraddress", cartcontroller.adduseraddress);
  app.post("/resendorderemail", cartcontroller.resendorderemail);
  app.post("/removecartitem", cartcontroller.removecartitem);
  app.post("/uploadimage", cartcontroller.uploadimage);
  app.post(
    "/filterlist",
    [authJwt.checkguest],
    [authJwt.updateLastlogin],
    filtercontroller.filteroptions_new
  );
  app.post("/getsizes", cartcontroller.getsizes);
  app.post("/updateorderstatus", cartcontroller.updateorderstatus);

  app.post("/getuserinfo", authcontroller.getuserinfo);

  app.post("/getshippingcharge", cartcontroller.getshippingcharge);

  app.post(
    "/fetchproducts",
    require("../controller/productfetchController_new").filteroptions_new
  );
  app.post(
    "/esearchfetchproducts",
    productfetchController_esearch.filteroptions
  );
  app.post("/getproductvarient", productcontroller.getproductvarient);
  app.post("/getproducturl", productcontroller.getproducturl);
  app.post("/productattributes", productcontroller.productattributes);
  app.post("/editproduct", productcontroller.editproduct);
  app.post("/editproductdiamond", productcontroller.editproductdiamond);
  app.post("/updateskuinfo", productcontroller.updateskuinfo);
  app.post("/updateskupriceinfo", productcontroller.updateskupriceinfo);
  app.post("/editproductgemstone", productcontroller.editproductgemstone);
  app.post("/updateproductattr", productcontroller.updateproductattr_bk);
  app.post("/updateproductimage", productcontroller.updateproductimage);
  app.post("/productdetails", productcontroller.productdetails);

  app.post("/updateproductattribute", productcontroller.updateproductattribute);
  app.post("/updateproductimage", productcontroller.updateproductimage);
  // app.post("/productdetails", productcontroller.productdetails);
  app.post("/updatevendor", master_uploaddata_controller.updatevendor);
  app.post(
    "/getnewvendorcode",
    master_uploaddata_controller.generatevendorcode
  );

  app.post("/updatebestseller", master_uploaddata_controller.updatebestseller);
  app.post(
    "/updatereadytoship",
    master_uploaddata_controller.updatereadytoship
  );
  app.post("/pincodemaster", master_uploaddata_controller.updatepincode);
  app.post(
    "/updateproduct_color",
    master_uploaddata_controller.updateproduct_color
  );
  app.post(
    "/updateproduct_gender",
    master_uploaddata_controller.updateproduct_gender
  );
  app.post(
    "/updateproduct_purity",
    master_uploaddata_controller.updateproduct_purity
  );
  app.post(
    "/updateproduct_stonecolor",
    master_uploaddata_controller.updateproduct_stonecolor
  );
  app.post("/updateurlparams", master_uploaddata_controller.updateurlparams);
  app.post(
    "/updatecodpincodes",
    master_uploaddata_controller.updatecodpincodes
  );
  app.post(
    "/updatedefaultimage",
    master_uploaddata_controller.updatedefaultimage
  );
  app.get(
    "/viewskupricesummary/:skuid",
    master_uploaddata_controller.viewskupricesummary
  );
  app.post(
    "/updateproductcreatedate",
    master_uploaddata_controller.updateproductcreatedate
  );
  app.post(
    "/updategemstonepricemaster",
    master_uploaddata_controller.updategemstonepricemaster
  );
  app.post(
    "/updatecustomerreviews",
    master_uploaddata_controller.updatecustomerreviews
  );
  app.post("/updatetax", master_uploaddata_controller.updatetax);

  app.post("/managetaxsetup", configurationcontroller.managetaxsetup);
  app.post("/manageproducttypes", configurationcontroller.manageproducttypes);
  app.post("/managegenders", configurationcontroller.managegenders);
  app.post("/managegemtypes", configurationcontroller.managegemtypes);
  app.post("/managegemshapes", configurationcontroller.managegemshapes);
  app.post("/managegemsettings", configurationcontroller.managegemsettings);
  app.post("/managediamondtypes", configurationcontroller.managediamondtypes);
  app.post(
    "/managediamondsettings",
    configurationcontroller.managediamondsettings
  );
  app.post("/managediamondshapes", configurationcontroller.managediamondshapes);
  app.post("/managedesigns", configurationcontroller.managedesigns);
  app.post("/managecollections", configurationcontroller.managecollections);
  app.post("/managepurities", configurationcontroller.managepurities);
  app.post("/managemetalcolors", configurationcontroller.managemetalcolors);
  app.post("/managematerials", configurationcontroller.managematerials);
  app.post("/managecategories", configurationcontroller.managecategories);
  app.post("/manageearring", configurationcontroller.manageearring);
  app.post(
    "/managemasterattributes",
    configurationcontroller.managemasterattributes
  );
  app.post("/managestyles", configurationcontroller.managestyles);
  app.post("/managethemes", configurationcontroller.managethemes);
  app.post("/managestones", configurationcontroller.managestones);
  app.post("/managestonecolors", configurationcontroller.managestonecolors);
  app.post("/managestoneshapes", configurationcontroller.managestoneshapes);
  app.post("/manageweights", configurationcontroller.manageweights);
  app.post("/manageoccassions", configurationcontroller.manageoccassions);
  app.post("/managepaymentstatus", configurationcontroller.managepaymentstatus);
  app.post("/manageorderstatus", configurationcontroller.manageorderstatus);
  app.post("/manageseoattributes", configurationcontroller.manageseoattributes);
  app.post("/manageshippingzone", configurationcontroller.manageshippingzone);
  app.post(
    "/manageshipmentsettings",
    configurationcontroller.manageshipmentsettings
  );
  app.post(
    "/manageshippingattributes",
    configurationcontroller.manageshippingattributes
  );
  app.post("/managepages", configurationcontroller.managepages);
  app.post("/manageroles", configurationcontroller.manageroles);
  app.post("/managepermissions", configurationcontroller.managepermissions);
  app.post("/getrolepermissions", configurationcontroller.getrolepermissions);
  app.post("/getwebusers", configurationcontroller.getwebusers);
  app.post("/managetaxattributes", configurationcontroller.managetaxattributes);
  app.post(
    "/silverproductpriceupdate",
    [authJwt.checkorigin],
    component_price_update.silverproductpriceupdate
  );
  //app.post('/updateproductattributes', component_price_update.updateproductattributes);

  app.post("/sendtoairpay", cartcontroller.sendtoairpay);

  app.post(
    "/updatefilterposition",
    master_uploaddata_controller.updatefilterposition
  );

  app.post("/managetaxsetup2", configurationcontroller.managetaxsetup2);
  app.post("/forceindex", async function (req, res) {
    try {
      const _obj = {
        method: "post",
        url: turl,
        data: {},
      };

      const py1 = {
        properties: {
          autocomplete: {
            type: "text",
            analyzer: "autocomplete",
            search_analyzer: "autocomplete_search",
          },
          sku_url: { type: "text" },
          product_name: { type: "text" },
        },
      };

      const _py1s = {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {
                tokenizer: "autocomplete",
                filter: ["lowercase"],
              },
              autocomplete_search: {
                tokenizer: "lowercase",
              },
            },
            tokenizer: {
              autocomplete: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 20,
                token_chars: ["letter"],
              },
            },
          },
        },
      };

      const py2 = {
        properties: {
          sku_code: {
            type: "text",
          },
          sku_url: {
            type: "text",
          },
          sku_code_prefix: {
            type: "text",
          },
          sku_code_search: {
            type: "completion",
            analyzer: "simple",
            preserve_separators: true,
            preserve_position_increments: true,
            max_input_length: 50,
          },
        },
      };

      const py3 = {
        properties: {
          seo_url: {
            type: "text",
          },
          seo_search: {
            type: "completion",
          },
        },
      };

      let _index = ES_INDEXS;

      Promise.all([
        deleteIndex(_index[0]),
        deleteIndex(_index[1]),
        deleteIndex(_index[2]),
      ])
        .then((response) => {
          console.log("» » » Index deleted");
          Promise.all([
            initIndex(_index[0], _py1s),
            initIndex(_index[1], false),
            initIndex(_index[2], _py1s),
          ]).then((init_index) => {
            console.log("» » » Index created");

            Promise.all([
              initMapping(_index[0], "_doc", py1),
              initMapping(_index[1], "_doc", py2),
              initMapping(_index[2], "_doc", py3),
            ])
              .then((_mapp) => {
                console.log("» » » Mapping created");
                axios(_obj)
                  .then(async (response) => {
                    console.log("» »", response.status);
                    let productSearch = response["data"]["product_list"];
                    let skuSearch = response["data"]["sku_list"];
                    let seoSearch = response["data"]["seo_list"];

                    let productArray = [];
                    let skuArray = [];
                    let seoArray = [];
                    let doc_array = [];

                    /* filter response Array to new-one */

                    /*product_search mapper */
                    (async function () {
                      await Promise.all(
                        productSearch.map(async (li) => {
                          productArray.push({
                            index: {
                              _index: "product_search",
                              _type: "_doc",
                              _id: uuidv4(),
                            },
                          });
                          productArray.push({
                            product_name: li.product_name
                              ? li.product_name
                              : "",
                            sku_url:
                              li.trans_sku_lists.length > 0
                                ? li.trans_sku_lists[0]["sku_url"]
                                : "",
                            autocomplete: li.product_name
                              ? li.product_name
                              : "",
                          });
                        })
                      );
                    })();

                    /*sku_code search mapper*/
                    (async function () {
                      await Promise.all(
                        skuSearch.map(async (li) => {
                          skuArray.push({
                            index: {
                              _index: "sku_search",
                              _type: "_doc",
                              _id: uuidv4(),
                            },
                          });
                          skuArray.push({
                            sku_code: li.generated_sku,
                            sku_url: li.sku_url,
                            sku_code_prefix: li.generated_sku,
                            sku_code_search: li.generated_sku
                              ? li.generated_sku.split(/[ ,]+/)
                              : "",
                          });
                        })
                      );
                    })();

                    /*seo_url search mapper*/
                    (async function () {
                      await Promise.all(
                        seoSearch.map(async (yl) => {
                          seoArray.push({
                            index: {
                              _index: "seo_search",
                              _type: "_doc",
                              _id: uuidv4(),
                            },
                          });
                          seoArray.push({
                            seo_url: yl.seo_url ? yl.seo_url : "",
                            seo_name: yl.seo_text ? yl.seo_text : "",
                            autocomplete: yl.seo_text ? yl.seo_text : "",
                          });
                        })
                      );
                    })();

                    let dataSet = [productArray, seoArray, skuArray];

                    for (const item of dataSet) {
                      console.log(">>", item.length);
                      let tempArray = arrayChunk(item, 800);
                      for (let index = 0; index < tempArray.length; index++) {
                        const element = tempArray[index];
                        await docBulk(element);
                        console.log(">> Completed >>", index);
                      }
                    }

                    res
                      .status(200)
                      .send({ message: "Successfully reindexed all data!" });
                  })
                  .catch((fetch_err) => {
                    console.error(fetch_err);
                    res.status(500).send({ ...fetch_err });
                  });
              })
              .catch((init_err) => {
                console.log(init_err);
                console.log("Error In Init Index");
                res.status(500).send({ ...init_err });
              });
          });
        })
        .catch((err_del) => {
          console.log(err_del);
          console.log("Error In Delete-Index");
          res.status(500).send({ ...err_del });
        });
    } catch (err) {
      console.log(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
          " - Error message : " +
          err
      );
      res.status(500).send({ ...err });
    }
  });
  app.post("/esearch_forceindex", async function (req, res) {
    try {
      let datapaylod = {};
      if (req.body.product_id) {
        datapaylod["product_id"] = req.body.product_id;
      }
      res.status(200).send({ message: "Success" });

      const _obj = {
        method: "post",
        url: turl,
        data: datapaylod,
      };
      const py1 = {
        properties: {
          autocomplete: {
            type: "text",
            analyzer: "autocomplete",
            search_analyzer: "autocomplete_search",
          },
          sku_url: { type: "text" },
          product_name: { type: "text" },
        },
      };
      const _py1s = {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {
                tokenizer: "autocomplete",
                filter: ["lowercase"],
              },
              autocomplete_search: {
                tokenizer: "lowercase",
              },
            },
            tokenizer: {
              autocomplete: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 20,
                token_chars: ["letter"],
              },
            },
          },
        },
      };
      const py2 = {
        properties: {
          sku_code: {
            type: "text",
          },
          sku_url: {
            type: "text",
          },
          sku_code_prefix: {
            type: "text",
          },
          sku_code_search: {
            type: "completion",
            analyzer: "simple",
            preserve_separators: true,
            preserve_position_increments: true,
            max_input_length: 50,
          },
        },
      };
      const py3 = {
        properties: {
          seo_url: {
            type: "text",
          },
          seo_search: {
            type: "completion",
          },
        },
      };
      let _index = ["product_search", "sku_search", "seo_search"];
      //   Promise.all([
      // 	deleteIndex(_index[0]),
      // 	deleteIndex(_index[1]),
      // 	deleteIndex(_index[2])
      //   ])
      // 	.then(response => {
      // 	  console.log("» » » Index deleted");
      // 	  Promise.all([
      // 		initIndex(_index[0], _py1s),
      // 		initIndex(_index[1], false),
      // 		initIndex(_index[2], _py1s)
      // 	  ]).then(init_index => {
      // 		console.log("» » » Index created");
      Promise.all([
        initMapping(_index[0], "_doc", py1),
        initMapping(_index[1], "_doc", py2),
        initMapping(_index[2], "_doc", py3),
      ])
        .then((_mapp) => {
          console.log("» » » Mapping created");
          axios(_obj)
            .then(async (response) => {
              console.log(response["data"]["product_list"].length);
              let productSearch = response["data"]["product_list"];
              let skuSearch = response["data"]["sku_list"];
              let seoSearch = response["data"]["seo_list"];
              let productArray = [];
              let skuArray = [];
              let seoArray = [];
              let doc_array = [];
              /* filter response Array to new-one */
              /*product_search mapper */
              (async function () {
                await Promise.all(
                  productSearch.map(async (li) => {
                    productArray.push({
                      index: {
                        _index: "product_search",
                        _type: "_doc",
                        _id: uuidv4(),
                      },
                    });
                    productArray.push({
                      product_name: li.product_name ? li.product_name : "",
                      sku_url:
                        li.trans_sku_lists.length > 0
                          ? li.trans_sku_lists[0]["sku_url"]
                          : "",
                      autocomplete: li.product_name ? li.product_name : "",
                    });
                  })
                );
              })();
              /*sku_code search mapper*/
              (async function () {
                await Promise.all(
                  skuSearch.map(async (li) => {
                    skuArray.push({
                      index: {
                        _index: "sku_search",
                        _type: "_doc",
                        _id: uuidv4(),
                      },
                    });
                    skuArray.push({
                      sku_code: li.generated_sku,
                      sku_url: li.sku_url,
                      sku_code_prefix: li.generated_sku,
                      sku_code_search: li.generated_sku
                        ? li.generated_sku.split(/[ ,]+/)
                        : "",
                    });
                  })
                );
              })();
              /*seo_url search mapper*/
              (async function () {
                await Promise.all(
                  seoSearch.map(async (yl) => {
                    seoArray.push({
                      index: {
                        _index: "seo_search",
                        _type: "_doc",
                        _id: uuidv4(),
                      },
                    });
                    seoArray.push({
                      seo_url: yl.seo_url ? yl.seo_url : "",
                      seo_name: yl.seo_text ? yl.seo_text : "",
                      autocomplete: yl.seo_text ? yl.seo_text : "",
                    });
                  })
                );
              })();
              skuArray = arrayChunk(skuArray, 30000);

              skuArray.map((el) => doc_array.push(docBulk(el)));
              //doc_array.push(deleteIndex(skuArray))
              doc_array.push(docBulk(productArray));
              doc_array.push(docBulk(seoArray));
              console.info("totalPromises12", productArray.length);
              Promise.all(doc_array)
                .then((response) => {
                  console.log("» » » Docs Uploaded");
                  console.log("Promises Resolved ", response.length);
                })
                .catch((_e) => {
                  console.log(_e.message);
                  console.log("Errror");
                });
            })
            .catch((fetch_err) => {
              console.error(fetch_err);
            });
          // 	  })
          // 	  .catch(init_err => {
          // 		console.log(init_err);
          // 		console.log("Error In Init Index");
          // 	  });
          //   });
        })
        .catch((err_del) => {
          console.log(err_del);
          console.log("Error In Delete-Index");
        });
    } catch (err) {
      console.log(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
          " - Error message : " +
          err
      );
    }
  });
  app.post("/reindex", async function (req, res) {
    try {
      const { product_id } = req.body;
      let datapaylod = {
        query: {
          match_phrase_prefix: {
            sku_code_prefix: {
              query: product_id,
            },
          },
        },
      };
      const _obj = {
        method: "post",
        url: "https://search-elastic-server-uguyslt53rg63cttm2b4hgwkb4.ap-south-1.es.amazonaws.com/sku_search/_delete_by_query",
        data: datapaylod,
      };
      axios(_obj)
        .then(async (response) => {
          res.status(200).send({ message: "Success" });
        })
        .catch((err) => {
          res.status(500).send({ message: "Please try again later" });
        });
    } catch (err) {
      console.log(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
          " - Error message : " +
          err
      );
    }
  });
  app.post("/auto_complete", async function (req, res) {
    try {
      let { search_text } = req.body;
      console.log("====", search_text);
      let product_search = {
        query: {
          match: {
            autocomplete: {
              query: search_text,
              operator: "and",
              fuzziness: 2,
            },
          },
        },
      };
      let sku_search = {
        from: 0,
        size: 10,
        query: {
          match_phrase_prefix: {
            sku_code_prefix: {
              query: search_text,
              max_expansions: 15,
            },
          },
        },
      };
      let seo_search = {
        query: {
          match: {
            autocomplete: {
              query: search_text,
              operator: "and",
              fuzziness: 2,
            },
          },
        },
      };
      let p1 = esSearch("product_search", "_doc", product_search);
      let p2 = esSearch("sku_search", "_doc", sku_search);
      let p3 = esSearch("seo_search", "_doc", seo_search);
      Promise.all([p1, p2, p3])
        .then(async (es_response) => {
          let product_results = es_response[0]["message"]["hits"]["hits"];
          let sku_results = es_response[1]["message"]["hits"]["hits"];
          let seo_results = es_response[2]["message"]["hits"]["hits"];
          product_results = product_results.map((_obj) => {
            return _obj._source;
          });
          sku_results = sku_results.map((_obj) => {
            return _obj._source;
          });
          seo_results = seo_results.map((_obj) => {
            return _obj._source;
          });
          return res.json({
            product_results,
            sku_results,
            seo_results,
          });
        })
        .catch((err) => {
          console.log("err", err);
          return res.json(err);
        });
    } catch (err) {
      console.log(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
          " - Error message : " +
          err
      );
    }
  });
  app.post("/addholidays", (req, res) => {
    try {
      upload(req, res, (err) => {
        if (err) {
          res.status(400).send({
            error: err.message,
          });
        }
        const csv = require("csvtojson");

        csv()
          .fromFile(req.file.path)
          .then(async (data) => {
            try {
              res.status(200).send(await inventoryController.addHolidays(data));
            } catch (err) {
              res.status(400).send({
                error: err.message,
              });
            }
          })
          .catch((err) => {
            res.status(400).send({
              error: err.message,
            });
          });
      });
    } catch (err) {
      console.log(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
          " - Error message : " +
          err
      );
    }
  });
  app.post("/addinventories", (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          res.status(400).send({
            error: err.message,
          });
        }
        res.send({ status: true, message: "File processing started!" });

        const csv = require("csvtojson");

        var warehouses = await require("../models").warehouse.findAll({
          attributes: ["id", "name"],
          raw: true,
        });

        csv()
          .fromFile(req.file.path)
          .subscribe(
            async (data) => {
              return await inventoryController.addInventories(data, warehouses);
            },
            (err) => {
              console.log(err);
            },
            () => {
              console.log("Success", req.file.path);
              try {
                require("fs").unlink(req.file.path);
              } catch (error) {
                console.log(error);
              }
            }
          );
      });
    } catch (err) {
      console.log(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Calcutta",
        }) +
          " - Error message : " +
          err
      );
    }
  });

  app.post("/getshippingdate", async (req, res) => {
    try {
      res.status(200).send(await inventoryController.getShippingDate(req.body));
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: error.message,
      });
    }
  });
  app.post("/getcsvdata", productcontroller.csvDownload);
  app.post("/updateimagehover", productcontroller.imageHoverUpdate);
  app.post("/silverpriceupload", component_price_update.silverPriceUpload);
  app.post("/send_sms", async (req, res) => {
    try {
      res.status(200).send(await send_sms(req.body));
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.post("/trigger_mail", cartcontroller.trigger_mail);
  app.post("/send_error_mail", async (req, res) => {
    try {
      // let moment = require("moment");
      // let email_subject = `Error Observed in ${process.env.NODE_ENV} at ${moment
      //   .tz(new Date(), "Asia/Kolkata")
      //   .format("DD MMM YYYY HH:mm:ss")}`;
      // const email_recipients = [
      //   { to: "dineshtawker@gmail.com", subject: email_subject },
      //   { to: "samir@crayond.co", subject: email_subject },
      // ];
      // require("../controller/notify/user_notify")
      //   .sendMail(email_recipients, JSON.stringify(req.body))
      //   .then((result) => {
      //     console.log(result);
      //     res.status(200).send({ message: "Successfully mail sent" });
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     res.status(500).send({ message: error.message });
      //   });
      require("../models")
        .ui_error_log.insert({
          ...req.body,
        })
        .then((result) => {
          res.status(200).send({ message: "Successfully Logged!" });
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });
  app.post("/verify_payment", async (req, res) => {
    try {
      res.status(200).send(await cartcontroller.verify_payment(req.body));
    } catch (error) {
      console.log(error);
      res.status(500).send({ ...error });
    }
  });
  app.get("/mail_status", (req, res) => {
    let { message_id } = req.query;
    let token =
      "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";
    require("axios")
      .get(`https://api.sendgrid.com/v3/messages/${message_id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => res.send(response))
      .catch((err) => {
        console.log(err.response.data);
        res.status(err.response.status || 500).send(err.response.data);
      });
  });
  const otpController = require("../controller/otpController");
  app.post("/send_otp", async (req, res) => {
    try {
      res.status(200).send(await otpController.sendOtp(req.body));
    } catch (error) {
      res.status(error.statusCode || 500).send({ error: true, ...error });
    }
  });
  app.post("/resend_otp", async (req, res) => {
    try {
      res.status(200).send(await otpController.resendOtp(req.body));
    } catch (error) {
      res.status(error.statusCode || 500).send({ error: true, ...error });
    }
  });
  app.post("/verify_otp", async (req, res) => {
    try {
      res.status(200).send(await otpController.verifyOtp(req.body));
    } catch (error) {
      res.status(error.statusCode || 500).send({ error: true, ...error });
    }
  });
  app.post("/api/auth/mediasignin", authcontroller.mediaSignin);
  app.post("/fxSynclatest", cartcontroller.syncFxRate);
  app.get("/get_pincode_details", async (req, res) => {
    try {
      res.status(200).send(await cartcontroller.getPincodeDetails(req.query));
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  app.post(
    "/banner_image_upload",
    require("../controller/image_controller").banner_image_uploder
  );
  app.get("/fetch_filters", filtercontroller.fetchFilters);
  app.post("/bulk_upload_filters", async (req, res) => {
    try {
      upload(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        res
          .status(200)
          .send({ status: true, message: "File processing started!" });
        filtercontroller.upsertProductFilters({ filepath: req?.file?.path });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  /*
  This section is for new price engine API
  */
  const {
    componentPriceEngine,
    componentFinalPriceRun,
    priceUpdate,
    finalPriceRun,
    createPriceRunHistory,
    updatePriceRunHistory,
  } = require("../controller/price_engine");
  app.post("/price_run_new", async (req, res) => {
    try {
      let { pricingcomponent: pricing_component, req_product_id } = req.body;
      if (!req_product_id || req_product_id.length == 0) {
        throw new Error("req_product_id is required!");
      }
      if (!Array.isArray(req_product_id)) {
        req_product_id = [req_product_id];
      }
      let priceHistory = await createPriceRunHistory({
        pricing_component,
        product_ids: req_product_id.join(","),
        total_product: req_product_id.length,
      });
      res.status(200).send({ status: "started", priceHistory });
      const models = require("../models");
      req_product_id = arrayChunk(req_product_id, 200);
      Promise.allSettled(
        req_product_id.map(async (products) => {
          await Promise.allSettled(
            products.map(async (item) => {
              try {
                if (pricing_component == "updateskuprice") {
                  await priceUpdate({ product_id: item });
                }
                if (
                  pricing_component == "Diamond" ||
                  pricing_component == "Gemstone"
                ) {
                  await componentPriceEngine({
                    product_id: item,
                    type: pricing_component.toLowerCase(),
                  });
                }
                if (pricing_component == "Gold") {
                  await componentPriceEngine({
                    product_id: item,
                    type: pricing_component.toLowerCase(),
                  });
                  await componentPriceEngine({
                    product_id: item,
                    type: "making_charge",
                  });
                }
                await updatePriceRunHistory(priceHistory.id, {
                  completed_product_count: models.sequelize.literal(
                    `completed_product_count+1`
                  ),
                  completed_products: models.sequelize.literal(
                    `completed_products || ',' || '${item}'`
                  ),
                });
              } catch (error) {
                console.log(error);
                throw error;
              }
            })
          );
        })
      ).then(async () => {
        if (pricing_component == "updateskuprice") {
          await finalPriceRun();
          /* Updating Carts to Latest Run Price */
          await models.sequelize.query(`update shopping_cart_items i
                                        set price = qty * (select markup_price from trans_sku_lists t
                                        where i.product_sku = t.generated_sku)
                                        where shopping_cart_id not in (select cart_id from public.orders)`);
          await models.sequelize
            .query(`update shopping_carts c set gross_amount = sub.total,discounted_price=sub.total
                    from
                    (select sum(price) as total,shopping_cart_id from shopping_cart_items
                    where shopping_cart_id not in (select cart_id from public.orders)
                    group by shopping_cart_id ) as sub
                    where c.id = sub.shopping_cart_id`);
        } else {
          let processTypes = [];
          if (pricing_component == "Gold") {
            processTypes.push("pricing_sku_metals");
          } else if (
            pricing_component.includes("Diamond") ||
            pricing_component.includes("Gemstone")
          ) {
            processTypes.push("pricing_sku_materials");
          }
          await componentFinalPriceRun(processTypes);
        }
        await updatePriceRunHistory(priceHistory.id, { is_completed: true });
        await models.temp_price_list.truncate();
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ ...error });
    }
  });
  /*
  This new price engine API section ends here
  */
  app.post("/fetch_es_list", async (req, res) => {
    try {
      res.status(200).send(await fetchESRecordsFromDB(req.body));
    } catch (error) {
      console.log(error);
      res.status(500).send({ ...error });
    }
  });
  app.post("/sync_elastic_search", async (req, res) => {
    try {
      let { type, product_ids } = req.body;
      let fetchProducts = true,
        fetchSeos = true,
        fetchSkus = true;
      if (type == "products") {
        fetchSeos = false;
        fetchSkus = false;
      }
      if (type == "sku") {
        fetchSeos = false;
        fetchProducts = false;
      }
      if (type == "seo") {
        fetchProducts = false;
        fetchSkus = false;
      }
      res.status(200).send({
        success: true,
        message: "Sync initiated successfully!",
      });
      let result = await fetchESRecordsFromDB({
        product_ids,
        fetchProducts,
        fetchSeos,
        fetchSkus,
      });
      await Promise.all(
        Object.keys(result).map(async (i) => {
          await fullIndexSync({
            indexName: i.replace("list", "search"),
            feedData: result[i],
            initalizeRequired: product_ids && product_ids.length == 0,
          });
        })
      );
    } catch (error) {
      console.log(error);
      res.status(500).send({ ...error });
    }
  });
  app.post("/es_status", async (req, res) => {
    try {
      let result = await Promise.all(
        ES_INDEXS.map(async (indexName) => {
          return await indexDocumentsCount({ indexName });
        })
      );
      res.status(200).send(
        result.reduce((accumulator, item, index) => {
          accumulator[ES_INDEXS[index]] = item.count;
          return accumulator;
        }, {})
      );
    } catch (error) {
      console.log(error);
      res.status(500).send({ ...error });
    }
  });
  app.post("/bulk_upload_combo", async (req, res) => {
    try {
      upload(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        res
          .status(200)
          .send({ status: true, message: "File processing started!" });
        upsertComboOffers({ filepath: req?.file?.path });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: true,
        message: error?.message || "Something went wrong!",
      });
    }
  });
  app.post("/fetch_combo_offer", async (req, res) => {
    try {
      res.status(200).send(await displayComboOffer(req.body));
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: true,
        message: error?.message || "Something went wrong!",
      });
    }
  });
  app.post("/fetch_cart_details", async (req, res) => {
    try {
      res.status(200).send(await cartcontroller.fetchCartDetails(req.body));
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: true,
        message: error?.message || "Something went wrong!",
      });
    }
  });
};
