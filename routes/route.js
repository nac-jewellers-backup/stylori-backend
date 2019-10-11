const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const authcontroller = require('../controller/authcontroller.js');
	const productcontroller = require('../controller/productcontroller.js');
	const pricingontroller = require('../controller/pricingcontroller.js');
	const productupdatecontroller = require('../controller/productupdatecontroller.js');
	const discountcontroller = require('../controller/checkdiscount.js');
	const updatesizecontroller = require('../controller/product_size_update_controller.js');
    const cartcontroller = require('../controller/cartcontroller.js');

	app.post('/api/auth/signin', authcontroller.signin);
	app.post('/api/auth/signup', authcontroller.signup);	
	app.post('/verification/:email/:token', authcontroller.verification);
	app.post('/forgotpassword', authcontroller.forgotpassword);
	app.post('/resetpassword', authcontroller.resetpassword);

	app.post('/productupload', productcontroller.productupload);
	app.post('/productupdate', productupdatecontroller.updateproduct);

	app.get('/api/userprofile', [authJwt.verifyToken], authcontroller.userContent);
	app.post('/updatepricelist', pricingontroller.priceupdate);
	app.post('/checkdiscount', discountcontroller.checkdiscount);
	app.post('/updatesize', updatesizecontroller.updatesize);
	app.post('/api/auth/guestlogin', authcontroller.guestlogin);
	app.post('/api/auth/verifyotp', authcontroller.verifyotp);
	
	app.post('/addtocart', cartcontroller.addtocart);

}