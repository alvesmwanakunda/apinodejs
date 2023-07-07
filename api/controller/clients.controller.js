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
     const axios = require("axios");
     const { ObjectId } = require('mongodb');


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
                        req.body.valid=true;
                       
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
                                        user.save(async function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            client.save(); 
                                            if(client){
                                                operationService.addOperationByEntrepise(req.params.id, client._id,user);
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
                        req.body.valid = true;
                       
                        var user = new User(req.body);

                        client.genre = req.body.genre;
                        client.adresse = req.body.adresse;
                        client.dateNaissance = req.body.age;

                        if(req.body.age){
                            //console.log("Date naissance", req.body.age);
                            client.day = new Date(req.body.age).getDate();
                            client.month = new Date(req.body.age).getMonth()+1;
                        }
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
                                        user.save(async function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            client.save(); 

                                            let grant = `grant_type=client_credentials`;
                                            const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
                                            {
                                            headers:{
                                                Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                            }
                                            
                                            });

                                            if(response.data.access_token){
                                                clientService.inscriptionSmsPhone(user,response.data.access_token);
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

            sharedAddClient(req, res){ 

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
                        req.body.valid = true;
                       
                        var user = new User(req.body);

                        client.genre = req.body.genre;
                        client.adresse = req.body.adresse;
                        client.dateNaissance = req.body.age;

                        if(req.body.age){
                            //console.log("Date naissance", req.body.age);
                            client.day = new Date(req.body.age).getDate();
                            client.month = new Date(req.body.age).getMonth()+1;
                        }
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
                                
                                user.password = crypto.createHash('md5').update(password).digest("hex");
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
                                        user.save(async function(err, user){
                                            if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                            client.save(); 
                                            if(client){
                                                operationService.addOperationByEntrepiseFile(req.params.id, client._id,user);
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
                                                clientService.inscriptionSms(user,password,response.data.access_token);
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
                      var client = {};
                      var query = {};
                      let path = "./public/" + req.file.filename;
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
                                  C:'phone',
                                  D:'genre',
                                  E:'adresse'
                              }
                          }]
                      });

                      try {

                            let clients = [];
                            const results = [];
                            clients = excelData.clients;

                            for(let i=0; i<clients.length; i++){

                                let clientInfo = clients[i];
                                if(!clientInfo.phone){
                                    results.push({
                                        success:false,
                                        message: "Veuillez vérifier le champ phone",
                                        data: clientInfo
                                    })
                                }
                                else if (!/^\d{9}$/.test(clientInfo.phone)) {
                                    results.push({
                                      success: false,
                                      message: 'Le numéro de téléphone doit être un nombre à 9 chiffres',
                                      data: clientInfo
                                    });
                                }
                                else{
                                    try {
                                         let userexists = await User.findOne({phone: clientInfo.phone }).exec();
                                         if(userexists){
                                            results.push({
                                                success: false,
                                                message: "Ce client, il est existé dans le système",
                                                data: clientInfo
                                            });
                                         }
                                         else{
                                                query ={
                                                    phone:clientInfo.phone
                                                };
                                                
                                                req.body.phone = clientInfo.phone;
                                                req.body.email=undefined;
                                                req.body.nom = clientInfo.nom;
                                                req.body.prenom = clientInfo.prenom;
                                                req.body.role = 'user';
                                                req.body.valid=true;
                                                var codeClient = Codes.generate({
                                                    length:5,
                                                    count:1,
                                                    charset: Codes.charset("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                                                });
                                                codeClient = codeClient[0];
    
                                                var user = new User(req.body);                                                
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
                                                            results.push({
                                                                success: false,
                                                                message: err
                                                            });
                                                        else
                                                            var code = Codes.generate({
                                                                length: 4,
                                                                count: 1,
                                                                charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                                            });
                                                            code = code[0];
                                                            user.code = code;
                                                            user.save(async function(err, user){

                                                                if(err){

                                                                    results.push({
                                                                        success: false,
                                                                        message: err
                                                                    });
                                                                    
                                                                }
                                                                else{

                                                                    client={
                                                                            genre:clientInfo.genre,
                                                                            adresse:clientInfo.adresse,
                                                                            dateCreated: new Date(),
                                                                            user : user._id,
                                                                            entreprise : req.params.id,
                                                                            numeroClient : codeClient
                                                                    };
                                                                    clientService.saveExcel(client,req.params.id);
        
                                                                    let grant = `grant_type=client_credentials`;
                                                                    const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
                                                                    {
                                                                        headers:{
                                                                            Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
                                                                        'Content-Type': 'application/x-www-form-urlencoded'
                                                                        }
                                                                        
                                                                    });
        
                                                                    if(response.data.access_token){
                                                                       clientService.inscriptionSms(user,password,response.data.access_token);
                                                                    }
                                                                    results.push({
                                                                        success: true,
                                                                        message: "Client ajouté avec succès",
                                                                        data: clientInfo
                                                                    });
                                                                }        
                                                            }) 
                                                    });
                                                });   
                                        } 
                                    } catch (error) {
                                        results.push({
                                            success: false,
                                            message: "Erreur lors de la recherche de l'utilisateur existant",
                                            data: clientInfo
                                          });
                                    }
                                }
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
                              results: results
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
                            operationService.deleteOperationToEntreprise(req.params.id,req.params.idEntreprise);
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

            deleteManyClient:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){

                    if(aclres){

                        let clients = req.body;
                        //console.log("Body", req.body);

                        Client.updateMany({_id:{$in:clients.map(function(obj){
                            return new ObjectId(obj.id)
                          })
                        }},
                        {
                            $pull:{entreprise:req.params.id}
                        },
                        {multi:true},
                        function(err,data){

                           if(err){
                            return callback({
                                error:err
                            })
                           }

                           else{
                            operationService.deleteMultiOperationEntreprise(clients,req.params.id);
                            res.status(200).end();
                           }
                          
            
                        });

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