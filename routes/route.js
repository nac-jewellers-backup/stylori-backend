const authJwt = require('./verifyJwtToken');
const productPricing = require('../controller/productMasters');

module.exports = function(app) {

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

	
	
	
	app.post('/api/auth/signup', authcontroller.signup);	
	app.post('/verification/:email/:token', authcontroller.verification);
	app.post('/forgotpassword', authcontroller.forgotpassword);
	app.post('/resetpassword',[authJwt.verifyToken], authcontroller.resetpassword);

	app.post('/productupload', productcontroller.productupload);
	app.post('/productupdate', productupdatecontroller.updateproduct);
	app.post('/priceupdate', productcontroller.priceupdate);

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

	app.post('/editproduct', productcontroller.editproduct);

	
	
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

	
	
}