const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const authcontroller = require('../controller/authcontroller.js');
	const productcontroller = require('../controller/productcontroller.js');
	const pricingontroller = require('../controller/pricingcontroller.js');
	const productupdatecontroller = require('../controller/productupdatecontroller.js');

	app.post('/api/auth/signin', authcontroller.signin);
	app.post('/api/auth/signup', authcontroller.signup);	
	app.post('/verification/:email/:token', authcontroller.verification);
	app.post('/forgotpassword', authcontroller.forgotpassword);
	app.post('/resetpassword', authcontroller.resetpassword);

	app.post('/productupload', productcontroller.productupload);
	app.post('/productupdate', productupdatecontroller.updateproduct);

	app.get('/api/userprofile', [authJwt.verifyToken], authcontroller.userContent);
	app.post('/updatepricelist', pricingontroller.priceupdate);

}