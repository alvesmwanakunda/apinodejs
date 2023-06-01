(function (){
    'use strict';
     var User = require('../models/users.model').UserModel;
     var Entreprise = require('../models/entreprises.model').EntrepriseModel;
     var Client = require('../models/clients.model').ClientsModel;
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
     const tokenService = require('../services/token.service');
     var Isemail = require('isemail');
     var connexionService= require('../services/connexion.service');
     var ObjectId = require('mongoose').Types.ObjectId;
     var TokenModel = require('../models/token.model').TokenModel;
     var FCM = require('fcm-node');
     var serverKey = process.env.SERVER_KEY;
     var fcm = new FCM(serverKey);
     const axios = require("axios");
     const queryString = require('node:querystring');

    
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
                        entreprise.creation = new Date();
                        

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
                                        user.save(async function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            entreprise.save();
                                            if(entreprise){
                                                entrepriseService.addAvoirToEntreprise(entreprise._id);
                                                entrepriseService.addTypePoint(entreprise._id);
                                            } 
                                            let grant = `grant_type=client_credentials`;
                                            const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
                                            {
                                                    headers:{
                                                        Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
                                                    'Content-Type': 'application/x-www-form-urlencoded'
                                                    }     
                                            });
                                            if(response.data.access_token){
                                                smsService.inscription(user,response.data.access_token); 
                                            }
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
                                            if(entreprise){
                                                entrepriseService.addAvoirToEntreprise(entreprise._id);
                                                entrepriseService.addTypePoint(entreprise._id);
                                            }
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

                  User.findOne(query).exec(async function(err, user){

                      //console.log("User", user);
                      //console.log("Entreprise", entreprise);
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
                      }, async function(err, role){
                          if(err)
                            return res.send({
                                success: false,
                                message: err
                            });
                          if(user.role=="agent"){
                              let entreprise = await Entreprise.findOne({createur:new ObjectId(user._id)});
                              if(entreprise){
                                connexionService.addConnexion(user._id,entreprise._id);
                              }  
                          }

                          let tokenUser = await TokenModel.findOne({user:user._id});
                          if(tokenUser){
                               tokenService.updateToken(user._id,token);
                          }else{
                               tokenService.createToken(user._id,token);
                          }
                          //console.log("Token", token);
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
                            length:4,
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
                        //password = password[0];
                        //user.password = crypto.createHash('md5').update(password).digest("hex");

                        user.save(async function(err,user){
                            if(err)
                            return res.status(500).json({
                                success: false,
                                message: err
                            });

                            let grant = `grant_type=client_credentials`;
                            const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
                            {
                                    headers:{
                                        Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
                                       'Content-Type': 'application/x-www-form-urlencoded'
                                     }
                                    
                            });
                            if(response.data.access_token){
                                smsService.reset(user,code,password,response.data.access_token); 
                            }
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

            changePasswordCode:function(req,res){
                User.findOne({
                    phone:req.body.phone,
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
                req.body.valid = true;
               
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
                                user.save(async function(err, user){
                                    if(err){

                                        return res.status(500).json({
                                            success: false,
                                            message: err
                                        });

                                    }

                                    let grant = `grant_type=client_credentials`;
                                    const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
                                    {
                                      headers:{
                                        Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
                                       'Content-Type': 'application/x-www-form-urlencoded'
                                     }
                                    
                                    });
                                    if(response.data.access_token){
                                      clientService.inscriptionSms(user, password,response.data.access_token);
                                    }
                                    entrepriseService.addUserToEntreprise(req.params.id,user._id);
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

            },

            getUser:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        User.findOne({_id:req.decoded.id}, function(err, user){

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

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            },
            
            updateProfil:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        let user = await User.findOne({_id:req.decoded.id});

                        user.nom = req.body.nom,
                        user.prenom = req.body.prenom,
                        //console.log("Date naissance", req.body.age);

                        User.findOneAndUpdate({_id:req.decoded.id},user,{new:true},function(err, user){
                           if(err){
                            return res.status(500).json({
                                success:false,
                                message: err
                            });
                           }
                           else{
                            res.json({
                                success:true,
                                message:user
                            });
                            if(user.role=="user"){
                                clientService.updateClient(req.decoded.id,req.body.genre,req.body.adresse,req.body.age);
                            }
                           }
                        });

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            },

            getUserClient:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        Client.findOne({user:req.decoded.id}, function(err, user){

                            //console.log("Token", req.headers.token);

                           if(err)
                            return res.status(500).json({
                                success:false,
                                message: err
                            });
                          res.json({
                              success:true,
                              message:user
                          });

                        }).populate("user");

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            },


            getAgent:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        User.findOne({_id:req.params.id}, function(err, user){

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

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            },
            
            updateProfilAgent:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        //console.log("Agent", req.params.id);

                        let user = await User.findOne({_id:req.params.id});
                        //console.log("Body", req.body);

                        user.nom = req.body.nom,
                        user.prenom = req.body.prenom,
                        user.poste = req.body.poste,

                        User.findOneAndUpdate({_id:req.params.id},user,{new:true},function(err, user){
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

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            },

            testNotification:function(req,res){

                console.log("server Key", process.env.SERVER_KEY);

                var message = {
                    to:req.body.token,
                    collapse_key: 'wefid_app',
    
                    notification:{
                        title: req.body.title,
                        body: req.body.body,
                        sound:  "default",
                        tag:'wefid_app',
                    }
                };
    
                fcm.send(message, function(err, response){
                    if(err){
                        console.log("Something has gone wrong!", err);
                        res.json({
                            message: err,
                            status: 'no'
                        });
                    }else{
                        console.log("Successfully sent with response: ", response);
                        res.json({
                            message: response,
                            status: 'success'
                        });
                    }
                })


            },

            messageTest:async function(req,res){

                try {

                    let grant = `grant_type=client_credentials`;
                    const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
                    {
                      headers:{
                        Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
                       'Content-Type': 'application/x-www-form-urlencoded'
                     }
                    
                    });
                    //console.log("Response", response.data);

                    if(response.data){
                        console.log("Token", response.data.access_token);
                        smsService.testMessage(response.data.access_token);
                        return res.json({
                            success: true,
                            message: response.data
                        }) 

                    }else{

                        return res.json({
                            success: false,
                        }) 
                    }
                  } catch (error) {
                    return res.json({
                        success: false,
                        message: error
                    }) 
                  } 
            },

            deleteCompte:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        User.findOneAndUpdate({_id:req.decoded.id},{valid:false},{new:true},function(err, user){
                            if(err){
                             return res.status(500).json({
                                 success:false,
                                 message: err
                             });
                            }
                            else{
                             res.json({
                                 success:true,
                                 message:user
                             });
                            }
                         });
                    }
                    else{
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