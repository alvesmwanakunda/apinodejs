(function (){
    'use strict';
     var User = require('../models/users.model').UserModel;
     var Entreprise = require('../models/entreprises.model').EntrepriseModel;
     var crypto  = require('crypto');
     var jwt = require('jsonwebtoken');
     var Encryption = require('../utils/Encryption');
     var config = require('../config');
     var Role = require('../models/roles.model');
     var Codes = require('voucher-code-generator');
     var nodemailer = require('nodemailer');
     const mailService = require('../services/mail.service');


     module.exports = function(acl){
        return{

            create:function(req, res){

                        let entreprise = new Entreprise();

                        req.body.email = req.body.email;
                        req.body.phone = req.body.phone;
                        req.body.role = 'user';
                       
                        var user = new User(req.body);

                        entreprise.nom = req.body.entreprise;
                        entreprise.createur = user._id;
                        

                        User.findOne({email:user.email}, function(err, userexists){
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

                            user.password = crypto.createHash('md5').update(user.password).digest("hex");

                            user.save(function(err, user){
                                if(err)
                                   return res.status(500).json({
                                       success: false,
                                       message: err
                                   });
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
                            });
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
                  if(!req.body.email)
                    return res.send({
                        success: false,
                        message: "L'authentification a échoué"
                    });
                  //console.log("Email", req.body.email)
                  var query={};
                  query = {
                      email:req.body.email,
                      desactive: false
                  };
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
                                  user:user
                              }
                          });
                      });
                  });
            },
            resetPassword:function(req,res){

                var query = {};
                if(!req.body.email)
                   return res.json({
                       success: false,
                       message:""
                   });
                query = {email:req.body.email};

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
            }
            
        };
     };
})();