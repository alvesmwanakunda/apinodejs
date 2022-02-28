(function (){
    'use strict';
     var User = require('../models/users.model').UserModel;
     var Entreprise = require('../models/entreprises.model').EntrepriseModel;
     var crypto  = require('crypto');
     var jwt = require('jsonwebtoken');
     var Encryption = require('../../utils/Encryption');
     var config = require('../../config');
     var Role = require('../models/roles.model');
     var Codes = require('voucher-code-generator');
     var nodemailer = require('nodemailer');
     const mailService = require('../services/mail.service');
     const smsService =  require('../services/sms.service');
     const entrepriseService = require('../services/entreprises.service');
     const clientService = require('../services/clients.service');
     const userService = require('../services/users.service');
     var Isemail = require('isemail');


     module.exports = function(acl){
        return{

            create:function(req, res){

                        let entreprise = new Entreprise();

                        var query = {};
                        if(!req.body.emailorphone)
                           return res.json({
                               success:false,
                               message: ""
                           });

                        if(Isemail.validate(req.body.emailorphone)){
                            query = {
                                email:req.body.emailorphone
                            };
                            req.body.email = req.body.emailorphone;
                        }else{
                            query ={
                                phone:req.body.emailorphone
                            };
                            req.body.phone = req.body.emailorphone;
                        }

                        req.body.role = 'admin_agent';
                       
                        var user = new User(req.body);

                        entreprise.nom = req.body.entreprise;
                        entreprise.createur = user._id;
                        entreprise.categorie = req.body.categorie;
                        

                        User.findOne(query, function(err, userexists){
                            if(err)
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            if(userexists){
                                return res.json({
                                    success: false,
                                    message: "already exists"
                                })
                            }

                            User.remove(query, function(err){

                                user.password = crypto.createHash('md5').update(user.password).digest("hex");

                                user.save(function(err, user){
                                    if(err)
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                    if(user.phone){

                                        var code = Codes.generate({
                                            length: 4,
                                            count: 1,
                                            charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                        });
                                        code = code[0];
                                        user.code = code;
                                        console.log("Code", code);
                                        user.save(function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            entreprise.save(); 
                                            smsService.inscription(user);
                                            res.json({
                                                success: true,
                                                message:user
                                            });   
                                        }) 

                                    }else{
                                        var code = Codes.generate({
                                        length:128,
                                        count:1,
                                        charset: Codes.charset("alphanumeric")
                                        });
                                        code = code[0];
                                        user.code = code;
                                        user.save(function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            entreprise.save(); 
                                            mailService.inscription(user);
                                            res.json({
                                                success: true,
                                                message:user
                                            });   
                                        }) 
                                    }   
                                });
                            })
   
                        });  
                     
               
            },
            userExist:function(req, res){
                User.findOne({email:req.body.email},function(err, result){
                    if(err || !result)
                        res.json({
                            message:{
                                exist:false
                            }
                        })
                    else
                       res.json({
                           message:{
                               exist:true
                           }
                       })
                })
            },
            login:function(req,res){
                  if(!req.body.emailorphone)
                    return res.send({
                        success: false,
                        message: "L'authentification a échoué"
                    });
                  //console.log("Email", req.body.email)
                  var query={};
                  if(Isemail.validate(req.body.emailorphone)){

                    query = {
                         email:req.body.emailorphone,
                         desactive: false,
                         valid:true
                     }
                  }else{
                      query = {
                        phone: req.body.emailorphone,
                        desactive: false,
                        valid:true
                    };
                  }
                  
                  query.password = crypto.createHash('md5').update(req.body.password).digest("hex");

                  //console.log("Query", query);

                  User.findOne(query).exec(function(err, user){

                      //console.log("User", user);
                      
                      if(err)
                        return res.send({
                            success: false,
                            message: err
                        });
                      if(!user) 
                         return res.json({
                             success: false,
                             message: "User not found"
                         }) 
                      var token = jwt.sign({
                          id:user._id,
                          role: Encryption.encrypt(user.role)
                      }, config.certif, {
                          expiresIn: '24h'
                      });

                      Role.findOne({
                          roles:user.role
                      }, function(err, role){
                          if(err)
                            return res,send({
                                success: false,
                                message: err
                            });
                          res.json({
                              success: true,
                              message:{
                                  token:token,
                                  code:token,
                                  user:user,
                                  prenom: (user.prenom ? user.prenom : ''),
                                  nom: (user.nom ? user.nom : ''),
                                  email: (user.email ? user.email : ''),
                                  phone: (user.phone ? user.phone : '')
                              }
                          });
                      });
                  });
            },
            resetPassword:function(req,res){

                //console.log("Body", req.body);

                var query = {};
                if(!req.body.emailorphone)
                   return res.json({
                       success: false,
                       message:""
                   });
                if(Isemail.validate(req.body.emailorphone)){
                  query = {email:req.body.emailorphone};
                  req.body.email = req.body.emailorphone;
                } else{
                   query = {phone:req.body.emailorphone};
                   req.body.phone = req.body.emailorphone; 
                }  
                

                User.findOne(query, function(err, user){
                    if(err)
                      return res.status(500).json({
                          success:false,
                          message:err
                      });
                    if(!user){
                        return res.json({
                            success:false,
                            message: "notfound"
                        });
                    }

                    if(Isemail.validate(req.body.emailorphone)){

                        var code = Codes.generate({
                            length:128,
                            count:1,
                            charset:Codes.charset("alphanumeric")
                        });
                        code = code[0];
                        user.code = code;
                        user.save(function(err,user){
                            if(err)
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                            mailService.reset(user);  
                            res.json({
                                success:true,
                                message:"ok"
                            });  
                        });

                    }
                    else{

                        var code = Codes.generate({
                            length:128,
                            count:1,
                            charset:Codes.charset("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                        });
                        code = code[0];
                        user.code = code;

                        var password = Codes.generate({

                            length: 10,
                            count: 1,
                            charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                        });
                        password = password[0];
                        user.password = crypto.createHash('md5').update(password).digest("hex");

                        user.save(function(err,user){
                            if(err)
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                            smsService.reset(user,code,password);  
                            res.json({
                                success:true,
                                message:"ok"
                            });  
                        });

                    }
                    
                });
            },
            changePassword:function(req,res){
                User.findOne({
                    email:req.body.email,
                    code: req.body.code
                }, function(err, user){
                    if(err)
                      return res.status(500).json({
                          success:false,
                          message: err
                      });
                    if(!user){
                        return res.json({
                            success: false,
                            message: "notFound"
                        });
                    }
                    user.code = "";
                    user.password = crypto.createHash('md5').update(req.body.password).digest("hex");
                    user.save(function(err,user){
                        if(err)
                          return res.status(500).json({
                              success:false,
                              message: err
                          });
                        res.json({
                            success:true,
                            message:user
                        });
                    });
                });
            },
            validcode: function (req, res) {
                User.findOne({
                    phone: req.body.phone,
                    code: req.body.code
                    }, function (err, user) {
                if (err)
                    return res.status(500).json({
                    success: false,
                    message: err
                    });

                if (!user) {
                    return res.json({
                    success: false,
                    message: "notfound"
                    });
                }

                user.valid = true;
                user.save(function (err, user) {
                    if (err)
                    return res.status(500).json({
                        success: false,
                        message: err
                    });

                    res.json({
                    success: true,
                    message: user
                    });
                });
                });
            },
            validemail: function (req, res) {
                User.findOne({
                email: req.body.email,
                code: req.body.code,
                valid: false
                }, function (err, user) {
                if (err)
                    return res.status(500).json({
                    success: false,
                    message: err
                    });

                if (!user) {
                    return res.json({
                    success: false,
                    message: "notfound"
                    });
                }

                user.valid = true;
                user.save(function (err, user) {
                    if (err)
                    return res.status(500).json({
                        success: false,
                        message: err
                    });

                    res.json({
                    success: true,
                    message: user
                    });
                });
                });
            },
            changePasswordProfil:function(req,res, next){
                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                       let lostPassword = crypto.createHash('md5').update(req.body.lostpassword).digest("hex");

                       let user= await User.findOne({_id:req.decoded.id, password:lostPassword});

                       if(user){

                        try {

                            user.password = crypto.createHash('md5').update(req.body.password).digest("hex");
                            user.save(function(err,user){
                                if(err)
                                  return res.status(500).json({
                                      success:false,
                                      message: err
                                  });
                                res.json({
                                    success:true,
                                    message:user
                                });
                            });
                               
                               
                           } catch (error) {
                               next(error)
                           }

                       }else{
                            return res.json({
                                success: false,
                                message: "User not found"
                            }) 
                       }

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })
            },

            listAgent:function(req,res){
                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        Entreprise.findOne({_id:req.params.id}, function(err, entreprises){

                          let users = entreprises.createur.filter(x => x.role=="agent");
                          //console.log("User", users);

                           if(err)
                            return res.status(500).json({
                                success:false,
                                message: err
                            });
                          res.json({
                              success:true,
                              message:users
                          });

                        }).populate('createur');

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })
            },

            createAgent:function(req, res){

                var query = {};
                if(!req.body.emailorphone)
                   return res.json({
                       success:false,
                       message: ""
                   });

                if(Isemail.validate(req.body.emailorphone)){
                    query = {
                        email:req.body.emailorphone
                    };
                    req.body.email = req.body.emailorphone;
                }else{
                    query ={
                        phone:req.body.emailorphone
                    };
                    req.body.phone = req.body.emailorphone;
                }

                req.body.role = 'agent';
               
                var user = new User(req.body);

                User.findOne(query, function(err, userexists){
                    if(err)
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    if(userexists){
                        return res.json({
                            success: false,
                            message: "already exists"
                        })
                    }

                    User.remove(query, function(err){

                        var password = Codes.generate({
                            length:8,
                            count:1,
                            charset: Codes.charset("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                          });
                          password = password[0];

                        user.password = crypto.createHash('md5').update(password).digest("hex");

                        user.save(function(err, user){
                            if(err)
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                            if(user.phone){

                                var code = Codes.generate({
                                    length: 4,
                                    count: 1,
                                    charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                });
                                code = code[0];
                                user.code = code;
                                console.log("Code", code);
                                user.save(function(err, user){
                                    if(err)
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                    entrepriseService.addUserToEntreprise(req.params.id,user._id);
                                    clientService.inscriptionSms(user, password);
                                    res.json({
                                        success: true,
                                        message:user
                                    });   
                                }) 

                            }else{
                                var code = Codes.generate({
                                length:128,
                                count:1,
                                charset: Codes.charset("alphanumeric")
                                });
                                code = code[0];
                                user.code = code;
                                user.save(function(err, user){
                                    if(err)
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                    entrepriseService.addUserToEntreprise(req.params.id,user._id);
                                    clientService.inscriptionClient(user,password);
                                    res.json({
                                        success: true,
                                        message:user
                                    });   
                                }) 
                            }   
                        });
                    })

                });  
             
       
            },

            deleteAgent:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                     User.findOne({_id:req.params.id},function(err, user){

                        if(err){
                            return res.status(500).json({
                                success:false,
                                message: err
                            });
                        }else{
                            userService.delete(user._id);
                            entrepriseService.deleteUserToEntreprise(req.params.idEntreprise,req.params.id);
                            res.status(200).end()
                        }                            
                     })   

                    }else{

                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })

                    }
                })

            }
            
        };
     };
})();