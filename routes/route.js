const authJwt = require('./verifyJwtToken');
const productPricing = require('../controller/productMasters');
let {esSearch} = require('../controller/elasticServices');
module.exports = function(app) {
    const configurationcontroller = require('../controller/master_configuration.js');

    const authcontroller = require('../controller/authcontroller.js');
	const productcontroller = require('../controller/productcontroller.js');
	const pricingontroller = require('../controller/pricingcontroller.js');
	const productupdatecontroller = require('../controller/productupdatecontroller.js');
	const discountcontroller = require('../controller/checkdiscount.js');
	const updatesizecontroller = require('../controller/product_size_update_controller.js');
    const cartcontroller = require('../controller/cartcontroller.js');
    const filtercontroller = require('../controller/filtercontroller.js');
    const master_uploaddata_controller = require('../controller/master_uploaddata_controller.js');
    const pricesplitup_controller = require('../controller/pricesplitupcontroller.js');
    const single_product_pricecontroller = require('../controller/pricingcontroller_whole.js');
	const component_price_update = require('../controller/priceupdateController.js');
	const productfetchController_esearch = require('../controller/productfetchController_esearch.js');


	
    const productFetchController = require('../controller/productfetchController.js');


	app.post('/componentpriceupdate',component_price_update.priceupdate)

	app.post('/api/auth/signin', authcontroller.signin);
	app.post('/verifypasswordtoken', [authJwt.verifyToken], authcontroller.verifypasswordtoken);
	app.post('/changepassword', [authJwt.verifyToken], authcontroller.changepassword);
	
	app.post('/esearchcombination', productfetchController_esearch.esearchcombination);

	app.post('/fbsignin', authcontroller.fbsignin);
	app.post('/fbsignup', authcontroller.fbsignup);

		
	app.post('/api/auth/signup', authcontroller.signup);	
	app.post('/verification/:email/:token', authcontroller.verification);
	app.post('/forgotpassword', authcontroller.forgotpassword);
	app.post('/resetpassword',[authJwt.verifyToken], authcontroller.resetpassword);

	app.post('/ringpriceupdate', productcontroller.ringpriceupdate);

	app.post('/productupload', productcontroller.productupload);
	app.post('/productupdate', productupdatecontroller.updateproduct);
	app.post('/priceupdate', productcontroller.priceupdate);
	app.post('/disableproduct', productcontroller.disableproduct);
	app.post('/getproductlist', productcontroller.getproductlist);

	
	app.post('/productpriceupdate',single_product_pricecontroller.priceupdate)

	app.post('/splitdiamondpriceupdate',[productPricing.productList], pricesplitup_controller.splitdiamondpriceupdate);
	app.post('/splitgoldpriceupdate',[productPricing.productList], pricesplitup_controller.splitgoldpriceupdate);
	app.post('/splitmarkuppriceupdate',[productPricing.productList], pricesplitup_controller.splitmakingchargeupdate);
	app.post('/splitgemstonepriceupdate',[productPricing.productList], pricesplitup_controller.splitgemstonepriceupdate);
	app.post('/generatepaymenturl', cartcontroller.generatepaymenturl);
	app.post('/paymentsuccess', cartcontroller.paymentsuccess);
	app.post('/paymentfailure', cartcontroller.paymentfailure);

	app.post('/updateattributes', productupdatecontroller.updateattributes);
	
	app.post('/getpriceupdatestatus', productupdatecontroller.getpriceupdatestatus);

	app.post('/api/updateuserprofile', [authJwt.verifyToken], authcontroller.updateuserprofile);
	app.get('/api/userprofile', [authJwt.verifyToken], authcontroller.userContent);
	app.post('/updatepricelist', pricingontroller.priceupdate);
	app.post('/checkdiscount', discountcontroller.checkdiscount);
	app.post('/updatesize', updatesizecontroller.updatesize);
	app.post('/api/auth/guestlogin', authcontroller.guestlogin);
	app.post('/api/auth/verifyotp', authcontroller.verifyotp);
	
	app.post('/updatemetalprice', pricingontroller.updatemetalprice);
	app.post('/updatediamondprice', pricingontroller.updatediamondprice);
	app.post('/updategemstoneprice', pricingontroller.updategemstoneprice);
	app.post('/updatemakingcharge', pricingontroller.updatemakingcharge);
	app.post('/getvendorgemprice', pricingontroller.vendorgemprice);
	app.post('/getvendormakingprice', pricingontroller.vendormakingprice);
	app.post('/getdistinctproduct', pricingontroller.getdistinctproduct);
	app.get('/getlogfile', pricingontroller.logfile);
	app.post('/getcomponentpricestatus', pricingontroller.priceupdatestatus);
	app.post('/getaliasproduct', pricingontroller.getaliasproductlist);
	app.post('/creatediscount', pricingontroller.creatediscount);
	app.post('/checksalediscount', pricingontroller.checkdiscount);
	app.post('/getdiscount', pricingontroller.discountinfo);

	
	app.post('/updatemarkup', pricingontroller.updatemarkup);
	app.post('/addmarkup', pricingontroller.addmarkup);

	
	

	app.post('/api/auth/verifyotp', authcontroller.verifyotp);
	app.post('/addquestion', authcontroller.addquestion);
	app.post('/addemailsubscription', authcontroller.addemailsubscription);
	app.post('/asktoexport', authcontroller.asktoexport);


	
	app.post('/addwishlist', cartcontroller.addwishlist);
	app.post('/removewishlist', cartcontroller.removewishlist);
	app.post('/removeaddress', cartcontroller.removeaddress);
	app.post('/testorderconformation', cartcontroller.testorderemail);

	app.post('/productesearch', productfetchController_esearch.productesearch);

	app.post('/createorder', cartcontroller.addorder);

	app.post('/addproductreview', cartcontroller.addproductreview);
	app.post('/applyvoucher', cartcontroller.applyvoucher);
	app.post('/createvoucher', cartcontroller.createvoucher);
	app.post('/getvoucher', cartcontroller.getvoucher);

	app.post('/addgiftwrap', cartcontroller.addgiftwrap);
	app.post('/addtocart', cartcontroller.addtocart);
	app.post('/addaddress', cartcontroller.addaddress);
	app.post('/adduseraddress', cartcontroller.adduseraddress);
	app.post('/resendorderemail', cartcontroller.resendorderemail);
	app.post('/removecartitem', cartcontroller.removecartitem);
	app.post('/uploadimage', cartcontroller.uploadimage);
	app.post('/filterlist', filtercontroller.filteroptions);
	app.post('/getsizes', cartcontroller.getsizes);
	app.post('/fetchproducts', productFetchController.filteroptions);
	app.post('/esearchfetchproducts', productfetchController_esearch.filteroptions);
	app.post('/getproductvarient', productcontroller.getproductvarient);

	app.post('/editproduct', productcontroller.editproduct);
	app.post('/editproductdiamond', productcontroller.editproductdiamond);
	app.post('/updateskuinfo', productcontroller.updateskuinfo);
	app.post('/updateskupriceinfo', productcontroller.updateskupriceinfo);
	app.post('/editproductgemstone', productcontroller.editproductgemstone);
	app.post('/updateproductattr', productcontroller.updateproductattr);
	app.post('/updateproductimage', productcontroller.updateproductimage);

	
	
	app.post('/updatevendor', master_uploaddata_controller.updatevendor);
	app.post('/getnewvendorcode', master_uploaddata_controller.generatevendorcode);

	app.post('/updatebestseller', master_uploaddata_controller.updatebestseller);
	app.post('/updatereadytoship', master_uploaddata_controller.updatereadytoship);
	app.post('/pincodemaster', master_uploaddata_controller.updatepincode);
	app.post('/updateproduct_color', master_uploaddata_controller.updateproduct_color);
	app.post('/updateproduct_gender', master_uploaddata_controller.updateproduct_gender);
	app.post('/updateproduct_purity', master_uploaddata_controller.updateproduct_purity);
	app.post('/updateproduct_stonecolor', master_uploaddata_controller.updateproduct_stonecolor);
	app.post('/updateurlparams', master_uploaddata_controller.updateurlparams);
	app.post('/updatecodpincodes', master_uploaddata_controller.updatecodpincodes);
	app.post('/updatedefaultimage', master_uploaddata_controller.updatedefaultimage);
	app.get('/viewskupricesummary/:skuid', master_uploaddata_controller.viewskupricesummary);
	app.post('/updateproductcreatedate', master_uploaddata_controller.updateproductcreatedate);
	app.post('/updategemstonepricemaster', master_uploaddata_controller.updategemstonepricemaster);
	app.post('/updatecustomerreviews', master_uploaddata_controller.updatecustomerreviews);
	app.post('/updatetax', master_uploaddata_controller.updatetax);

	app.post('/managetaxsetup', configurationcontroller.managetaxsetup);
	app.post('/manageproducttypes', configurationcontroller.manageproducttypes);
	app.post('/managegenders', configurationcontroller.managegenders);
	app.post('/managegemtypes', configurationcontroller.managegemtypes);
	app.post('/managegemshapes', configurationcontroller.managegemshapes);
	app.post('/managegemsettings', configurationcontroller.managegemsettings);
	app.post('/managediamondtypes', configurationcontroller.managediamondtypes);
	app.post('/managediamondsettings', configurationcontroller.managediamondsettings);
	app.post('/managediamondshapes', configurationcontroller.managediamondshapes);
	app.post('/managedesigns', configurationcontroller.managedesigns);
	app.post('/managecollections', configurationcontroller.managecollections);
	app.post('/managepurities', configurationcontroller.managepurities);
	app.post('/managemetalcolors', configurationcontroller.managemetalcolors);
	app.post('/managematerials', configurationcontroller.managematerials);
	app.post('/managecategories', configurationcontroller.managecategories);
	app.post('/manageearring', configurationcontroller.manageearring);
	app.post('/managemasterattributes', configurationcontroller.managemasterattributes);

	app.post('/managestones', configurationcontroller.managestones);
	app.post('/managestonecolors', configurationcontroller.managestonecolors);
	app.post('/managestoneshapes', configurationcontroller.managestoneshapes);
	app.post('/manageweights', configurationcontroller.manageweights);

	app.post('/managetaxsetup2', configurationcontroller.managetaxsetup2);

	

	
	
	
	app.post("/auto_complete", async function(req, res) {
		let { search_text } = req.body;
		console.log("====", search_text);
		let product_search = {
		  query: {
			match: {
			  autocomplete: {
				query: search_text,
				operator: "and",
				fuzziness: 2
			  }
			}
		  }
		};
		let sku_search = {
		  from: 0,
		  size: 10,
		  query: {
			match_phrase_prefix: {
			  sku_code_prefix: {
				query: search_text,
				max_expansions: 15
			  }
			}
		  }
		};
		let seo_search = {
		  query: {
			match: {
			  autocomplete: {
				query: search_text,
				operator: "and",
				fuzziness: 2
			  }
			}
		  }
		};
		let p1 = esSearch("product_search", "_doc", product_search);
		let p2 = esSearch("sku_search", "_doc", sku_search);
		let p3 = esSearch("seo_search", "_doc", seo_search);
		Promise.all([p1, p2, p3])
		  .then(async es_response => {
			let product_results = es_response[0]["message"]["hits"]["hits"];
			let sku_results = es_response[1]["message"]["hits"]["hits"];
			let seo_results = es_response[2]["message"]["hits"]["hits"];
			product_results = product_results.map(_obj => {
			  return _obj._source;
			});
			sku_results = sku_results.map(_obj => {
			  return _obj._source;
			});
			seo_results = seo_results.map(_obj => {
			  return _obj._source;
			});
			return res.json({
			  product_results,
			  sku_results,
			  seo_results
			});
		  })
		  .catch(err => {
			console.log("err", err);
			return res.json(err);
		  });
	  });
	  



}