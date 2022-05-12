(function(){
    "use strict";
     var User = require('../models/users.model').UserModel;
     var Client = require('../models/clients.model').ClientsModel;
     var crypto  = require('crypto');
     var Codes = require('voucher-code-generator');
     var clientService = require('../services/clients.service');
     var Isemail = require('isemail');
     var excelToJson = require('convert-excel-to-json');
     var fs = require("fs");
     var operationService = require('../services/operation.service');


     module.exports = function(acl, app){

        return{

            createClient(req, res){ 

                //console.log("Dec",req.decoded);
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        var client = new Client();

                        var query = {};

                        //console.log("Body", req.body);
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

                        req.body.nom = req.body.nom;
                        req.body.prenom = req.body.prenom;
                        req.body.role = 'user';
                       
                        var user = new User(req.body);

                        client.genre = req.body.genre;
                        client.adresse = req.body.adresse;
                        client.dateNaissance = req.body.dateNaissance;
                        client.dateCreated = new Date();
                        client.user = user._id;
                        client.entreprise = req.params.id
                        var codeClient = Codes.generate({
                            length:5,
                            count:1,
                            charset: Codes.charset("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                        });
                        codeClient = codeClient[0];
                        client.numeroClient = codeClient;


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
                                    //console.log("Erreur", err);
                                    //console.log("User", user);
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
                                        user.save(function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            client.save(); 
                                            if(client){
                                                operationService.addOperationByEntrepise(req.params.id, client._id,user);
                                            }
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
                                            client.save(); 
                                            if(client){
                                                operationService.addOperationByEntrepise(req.params.id, client._id,user);
                                            }
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


                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })

            },

            addClient(req, res){ 

                //console.log("Dec",req.decoded);

                        var client = new Client();

                        var query = {};

                        //console.log("Body", req.body);
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

                        req.body.nom = req.body.nom;
                        req.body.prenom = req.body.prenom;
                        req.body.role = 'user';
                       
                        var user = new User(req.body);

                        client.genre = req.body.genre;
                        client.adresse = req.body.adresse;
                        client.dateNaissance = req.body.age;
                        client.dateCreated = new Date();
                        client.user = user._id;
                        //client.entreprise = req.params.id
                        var codeClient = Codes.generate({
                            length:5,
                            count:1,
                            charset: Codes.charset("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                        });
                        codeClient = codeClient[0];
                        client.numeroClient = codeClient;


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
                                
                                user.password = crypto.createHash('md5').update(req.body.password).digest("hex");
                                user.valid = true;

                                user.save(function(err, user){
                                    //console.log("Erreur", err);
                                    //console.log("User", user);
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
                                        user.save(function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            client.save(); 
                                            
                                            clientService.inscriptionSmsPhone(user);
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
                                            client.save(); 
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

            getAllClientsByEntreprise(req, res){
                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){
                    if(aclres){

                        let clients = await clientService.listClientByEntreprise(req.params.id);
                        res.json({
                            success: true,
                            message:clients
                        });
                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })
            },

            getClientById(req,res){
              acl.isAllowed(req.decoded.id, 'clients','retreive', async function(err, aclres){
                  if(aclres){
                     let client = await clientService.getClientById(req.params.id);
                     res.json({
                        success: true,
                        message:client
                     });

                  }else{
                    return res.status(401).json({
                       success: false,
                       message: "401"
                    });
                  }
              })
            },

            uploadClient(req,res, next){
                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){
                      if(req.file == undefined){
                          return res.status(400).send("Please upload an excel file!");
                      } 
                      //console.log("File", req.file); 
                      var client = {};
                      var query = {};
                      let path = "./public/" + req.file.filename;
                      // console.log("Path", path);
                      const excelData = excelToJson({
                          sourceFile:path,
                          sheets:[{
                              name:'clients',
                              header:{
                                  rows:1
                              },
                              columnToKey:{
                                  A:'nom',
                                  B:'prenom',
                                  C:'emailorphone',
                                  D:'genre',
                                  E:'adresse'
                              }
                          }]
                      });

                      try {

                            let clients = [];
                            clients = excelData.clients;

                            for(let i=0; i<clients.length; i++){

                                let clientInfo = clients[i];
                                //console.log("Info", clientInfo);
                                if(!clientInfo.emailorphone)
                                    return res.json({
                                        success:false,
                                        message: ""
                                    });
                            
                                    User.findOne({email:clientInfo.emailorphone}, function(err, userexists){

                                        //console.log("UserExists", userexists);
                                        if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                        if(!userexists){

                                            if(Isemail.validate(clientInfo.emailorphone.toString())){
                                                console.log("Ici");
                                                query = {
                                                    email:clientInfo.emailorphone
                                                };
                                            }else{
                                                query ={
                                                    phone:clientInfo.emailorphone
                                                };
                                            }

                                            if(query.phone){
                                              req.body.phone = clientInfo.emailorphone;
                                              req.body.email=undefined;
                                            }else if (query.email){
                                             req.body.email = clientInfo.emailorphone;
                                             req.body.phone = undefined;
                                            }
                                            req.body.nom = clientInfo.nom;
                                            req.body.prenom = clientInfo.prenom;
                                            req.body.role = 'user';
                                            var codeClient = Codes.generate({
                                                length:5,
                                                count:1,
                                                charset: Codes.charset("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                                            });
                                            codeClient = codeClient[0];

                                            var user = new User(req.body);
                                            //console.log("User ", user);
                                            
                                            User.remove(query, function(err){

                                                   //console.log("Erreur", err);

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
                                                            user.save(function(err, user){
                                                                if(err)
                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message: err
                                                                });
                                                                client={
                                                                    genre:clientInfo.genre,
                                                                    adresse:clientInfo.adresse,
                                                                    dateCreated: new Date(),
                                                                    user : user._id,
                                                                    entreprise : req.params.id,
                                                                    numeroClient : codeClient
                                                                };
                                                                //console.log("Client sms", client);
                                                                clientService.saveExcel(client);                                                                
                                                                clientService.inscriptionSms(user);
                                                                  
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
                                                                client={
                                                                    genre:clientInfo.genre,
                                                                    adresse:clientInfo.adresse,
                                                                    dateCreated: new Date(),
                                                                    user : user._id,
                                                                    entreprise : req.params.id,
                                                                    numeroClient : codeClient
                                                                };
                                                                //console.log("Client email", client);
                                                                clientService.saveExcel(client);
                                                                clientService.inscriptionClient(user,password);
                                                                   
                                                            }) 
                                                        }   
                                                    });
                                            });
                                        }    

                                    });
                            }

                            if(excelData){
                            fs.unlink(path, (err)=>{
                                if(err){
                                    console.error(err)
                                    return
                                }
                            })
                            } 

                            res.json({
                                success: true,
                                message:excelData.clients
                            }); 
                      } catch (error) {
                          next(error)
                      }
     
                    }else{
                        return res.status(401).json({
                        success: false,
                        message: "401"
                        });
                    }
                })
            },

            deleteClient:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                     Client.findOne({_id:req.params.id},function(err, user){

                        if(err){
                            return res.status(500).json({
                                success:false,
                                message: err
                            });
                        }else{
                            //userService.delete(user._id);
                            clientService.deleteClientToEntreprise(req.params.id, req.params.idEntreprise);
                            operationService.deleteOperationToEntreprise(req.params.id);
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


        }
     }


})();