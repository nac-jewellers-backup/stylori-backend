const jwt = require('jsonwebtoken');
import 'dotenv/config';
const models=require('./../models');

const verifyToken = (req, res, next) => {
	let token = req.headers['x-access-token'];
	console.log(token);
	if (!token){
		return res.status(403).send({ 
			auth: false, message: 'No token provided.' 
		});
	}

	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err){
			return res.status(500).send({ 
					auth: false, 
					message: 'Fail to Authentication. Error -> ' + err 
				});
		}
		console.log("here"+decoded.id)
		req.userName = decoded.id;
		next();
	});
}
const isAdmin = (req, res, next) => {
	let token = req.headers['x-access-token'];
	models.User.findOne({
        where: {
            userName: req.userName
        }
    }).then(user => {
			user.getRoles().then(roles => {
				for(let i=0; i<roles.length; i++){
					console.log(roles[i].name);
					if(roles[i].name.toUpperCase() === "ADMIN"){
						next();
						return;
					}
				}
				
				res.status(403).send("Require Admin Role!");
				return;
			})
		})
}
const updateLastlogin = async (req, res, next) => {
	if(req.userName)
	{
		await   models.user_profiles.update(
            lastlogin
            ,
                {where: {
                username: req.userName
                }
             }
            
		)
		next();
	}	else{
		next();
	}
	

}
const generateToken = (payload) => {
    try{
        let token = jwt.sign(payload,process.env.SECRET,{
            expiresIn:'1d'
        })
        return token
    }catch(error){
        console.error(error);         
    }
}

const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.generateToken = generateToken;
authJwt.updateLastlogin = updateLastlogin;

authJwt.isAdmin = isAdmin;
module.exports = authJwt;