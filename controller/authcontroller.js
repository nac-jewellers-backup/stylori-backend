import crypto from 'crypto-random-string';
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const models=require('./../models');
import 'dotenv/config';
const Op= require('sequelize').Op;
const uuidv1 = require('uuid/v1');

exports.signin = (req, res) => {
 
    models.users.findOne({

        where: {
          email: req.body.email
        },
        include: [{
            model: models.user_roles,
            attributes: ['id']
        }]
    }).then(user => {
        console.log(user)
        if (!user) {
            return res.status(404).send({"message":"User Does Not Exist"});
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, message: "Invalid Password!" });
        }
        
        var token = jwt.sign({ id: user.email }, process.env.SECRET, {
          expiresIn: '1d' // expires in 24 hours
        });
        models.user_profiles.findOne({
          where: {email:  user.email},
          attributes: ['id','email']
      }).then(userprofile => {
        res.status(200).send({  accessToken: token, userprofile });

      }).catch(err => {
          res.status(500).json({
              "description": "Can not access User Page",
              "error": err
          });
      })
    }).catch(err => {
        res.status(500).send('Error -> ' + err);
    });
}


exports.signup = (req, res) => {
  let {username, password, email, roles} = req.body;
  var uservalue = {
      id: uuidv1(),
      username: username,
      password: bcrypt.hashSync(password, 8),
      email: email
  }

  models.users.findOrCreate({
     
      where: { email },
      defaults: uservalue

    })
    .spread(async (user, created) => {
        if(!created)
        {
              res.send(409,{message:"Email ID Already Exist"});

        }else{
          let user_roles  =  await  models.master_roles.findAll({
              where: {
                  role_name :{
                      [Op.in]:roles
                  }
              }
            })
            var userroles = []
            user_roles.forEach(role => {
                  const roleobj = {
                      id:uuidv1(),
                      user_id: user.id,
                      role_name: role.role_name,
                      role_id:role.id
                  }
                  userroles.push(roleobj);
            })

                await models.user_roles.bulkCreate(
                  userroles, {individualHooks: true})
          var verifytoken = crypto({length: 16});
            
           await  models.access_tokens.create({
                id: uuidv1(),
                user_id: user.id,
                token: verifytoken
            })
            await models.user_profiles.create(
              {
                id:uuidv1(),
                user_id: user.id,
                email: email,
                isemailverified: false
              }

            )
          res.send(200,user);

        }

    })
}


exports.verification = (req, res) => {
    console.log(req.params.email)
    return models.User.findOne({
        where: { email: req.params.email }
      }).then(user => {
          if (user.isVerified) {
            return res.status(202).json(`Email Already Verified`);
          } else {
            return models.VerificationToken.findOne({
              where: { token: req.params.token,tokentype: 1, userId: user.id,
                    createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                  } }
            })
              .then((foundToken) => {
                
                if(foundToken){

                  return user
                    .update({ isVerified: true })
                    .then(updatedUser => {
                      return res.status(403).json(`User with ${user.email} has been verified`);
                    })
                    .catch(reason => {
                      return res.status(403).json(`Verification failed`);
                    });
                } else {
                  return res.status(404).json(`Token expired` );
                }
              })
              .catch(reason => {
                return res.status(404).json(`Token expired`);
              });
          }
        })
        .catch(reason => {
          return res.status(404).json(`Email not found1`);
        });
}
exports.resetpassword = (req, res) => {
    return models.User.findOne({
        where: { email: req.body.email }
      }).then(user => {
          
            return models.VerificationToken.findOne({
              where: { token: req.body.verificationToken,tokentype: 2, userId: user.id,
                    createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                  } }
            })
              .then((foundToken) => {
                
                if(foundToken){

                  return user
                    .update({ password:bcrypt.hashSync(req.body.password, 8) })
                    .then(updatedUser => {
                      return res.status(403).json(`Password Reset Successfully`);
                    })
                    .catch(reason => {
                      return res.status(403).json(`Please Try Again`);
                    });
                } else {
                  return res.status(404).json(`Token expired` );
                }
              })
              .catch(reason => {
                return res.status(404).json(`Token expired`);
              });
          
        })
        .catch(reason => {
          return res.status(404).json(`Email not found`);
        });
}
exports.forgotpassword = (req, res) => {
    return models.User.findOne({
        where: { email:  req.body.email }
        
      })
      .then(user => {
        console.log(user.id);
          // if user email already exists
        if(user)
        {  
        if(!user.isVerified) {
          return res.status(409).json('Please verify email then try reset password');
        } else {
              
                        return models.VerificationToken.create({
                            userId: user.id,
                            tokentype: 2,
                            token: crypto({length: 16})
                          }).then((result) => {
                           // sendVerificationEmail(user.email, result.token);
                            return res.status(200).json('Reset Password link sent to your registered Email Id'+result.token);
                          })
                          .catch((error) => {
                            return res.status(500).json(error);
                          });
      
        }
    }else{
        return res.status(404).json("Email ID not Registered with us");
    }
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
      
}
exports.userContent = (req, res) => {
    console.log(req.userName);
    models.User.findOne({
        where: {userName: req.userName},
        attributes: ['userName'],
        include: [{
            model: models.Role,
            attributes: ['id', 'name'],
            through: {
                attributes: ['userId', 'roleId'],
            }
        }]
    }).then(user => {
        res.status(200).json({
            "description": "User Content Page",
            "user": user
        });
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access User Page",
            "error": err
        });
    })
}

exports.guestlogin = (req, res) => {
  const {email} = req.body

  models.user_profiles.findOne({
      where: {email},
      attributes: ['user_id','id']
      
  }).then(user => {
      if(!user)
      {
        let otp = Math.floor(100000 + Math.random() * 900000)
        otp = '000000'
        const guest = {
          id:uuidv1(),
          email:email,
          otp:otp,
          isemailverified: false
        }
        models.user_profiles.create(guest, {
          returning: true
        }).then(guestuser => {
          res.status(200).json({
            "description": "User Content Page",
            "user": guestuser
        });
        });
      }else{
        res.status(200).json({
          "description": "User Content Page",
          "user": user
      });
      }
      
  }).catch(err => {
      res.status(500).json({
          "description": "Can not access User Page",
          "error": err
      });
  })
}


exports.verifyotp = (req, res) => {
  const {email,otp} = req.body

  models.user_profiles.findOne({
      where: {email,otp},
      attributes: ['id']
      
  }).then(user => {
      if(!user)
      {
        res.status(401).json({
          "message": "Otp wrong"
      });
      }else{
        res.status(200).json({
          "description": "User Content Page",
          "user": user
      });
      }
      
  }).catch(err => {
      res.status(500).json({
          "description": "Can not access User Page",
          "error": err
      });
  })
}