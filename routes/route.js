const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const authcontroller = require('../controller/authcontroller.js');
	app.post('/api/auth/signin', authcontroller.signin);
	app.post('/api/auth/signup', authcontroller.signup);	
	app.post('/verification/:email/:token', authcontroller.verification);
	app.post('/forgotpassword', authcontroller.forgotpassword);
	app.post('/resetpassword', authcontroller.resetpassword);


	app.get('/api/userprofile', [authJwt.verifyToken],[authJwt.isAdmin], authcontroller.userContent);

}