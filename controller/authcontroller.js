import crypto from 'crypto-random-string';
const models=require('./../models');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
import 'dotenv/config';
const Op= require('sequelize').Op;

exports.signin = (req, res) => {
    console.log("Sign-In");
        console.log(req.body);
    models.User.findOne({

        where: {
          email: req.body.email
        },
        include: [{
            model: models.Role,
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
        
        var token = jwt.sign({ id: user.userName }, process.env.SECRET, {
          expiresIn: '1d' // expires in 24 hours
        });
        
        res.status(200).send({ user_role:  user.Roles[0].id, accessToken: token });
    }).catch(err => {
        res.status(500).send('Error -> ' + err);
    });
}
exports.signup = (req, res) => {
    console.log(JSON.stringify(req.body.userName));
    var uservalue = {
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email
    }
    return models.User.findOrCreate({
       
        where: { email:  req.body.email },
        defaults: uservalue

      })
      .spread((user, created) => {
        console.log(user.userName);
          // if user email already exists
        if(!created) {
          return res.status(409).json('User with email address already exists');
        } else {
            models.Role.findAll({
                where: {
                  name: {
                      [Op.in]: req.body.roles
                    }
                }
              }).then(roles => {
               console.log(roles)
              //    res.status(200).send(roles);
                  if (user) {
                      user.setRoles(roles).then(() => {
                          var verifytoken = crypto({length: 16});
                        return models.VerificationToken.create({
                            userId: user.id,
                            token: verifytoken,
                            tokentype: 1
                          }).then((result) => {
                           // sendVerificationEmail(user.email, result.token);
                            return res.status(200).json(`${user.email} account created successfully. To verify your account please click this link localhost:8000/verification/${user.email}/${verifytoken}`);
                          })
                          .catch((error) => {
                            return res.status(500).json("error"+error);
                          });
      
                          
                      });
                  }
              }).catch(err => {
                  console.log("error")
                //  res.status(500).send("Error -> " + err);
              });
         
        }
      })
      .catch((error) => {
        return res.status(500).json("error1"+error);
      });
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
    console.log(req.query.email)
    return models.User.findOne({
        where: { email: req.query.email }
      }).then(user => {
          
            return models.VerificationToken.findOne({
              where: { token: req.query.verificationToken,tokentype: 2, userId: user.id,
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
                            return res.status(200).json('Reset Password link sent to your registered Email Id');
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