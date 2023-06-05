(function(){

    "use strict";
    var MessageClient = require('../models/messageClient.model').MessageClientModel;
    var User = require('../models/users.model').UserModel;
    var Client = require('../models/clients.model').ClientsModel;
    var fs = require("fs");
    var MessageAppService = require('../services/messageApp.service');
    var Entreprise = require('../models/entreprises.model').EntrepriseModel;
    var Codes = require('voucher-code-generator');


    module.exports = function(acl,app){

        return{

            testMessage(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let user = await User.findOne({phone:req.body.phone,role:{$eq:"user"}});

                        if(!user){

                            res.json({
                                success: false,
                                message:"Cette utilisateur n'est pas disponible sur Wefid"
                            });
                            
                        }else{
                           
                             Client.findOne({user:user._id},function(error,client){

                                if(error){

                                    return res.status(500).json({
                                        success: false,
                                        message: error
                                    });

                                }else{
                                    res.json({
                                        success: true,
                                        message:client
                                    });
                                }

                             })
                        }
                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })


            },

            createMessageTest(req,res,next){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let entreprise = await Entreprise.findOne({_id:req.params.id});
                        var code = Codes.generate({
                            length: 5,
                            count: 1,
                            charset: "0123456789"
                        });
                        code = code[0];

                        var message = new MessageClient(req.body);
                        message.entreprise = req.params.id;
                        let client = req.params.client;
                        message.dateCreated = new Date();
                        if(req.body.automatique){
                            message.automatique = req.body.automatique;
                        }else{
                            message.automatique = false; 
                        }
                        if(req.body.isCode){
                           message.isCode = req.body.isCode;
                           message.code = entreprise.nom+""+code;
                        }else{
                           message.isCode = false;
                        }

                        if(req.file){

                            try {

                                let path = "./public/" + req.file.filename;

                                fs.readFile(path,{encoding:'base64'}, async (err, data)=>{

                                    if(err){
                                        console.log("Erreur File", err);
                                    }
                                    
                                    message.photo = data;
                                    message.save(function(err, message){

                                        if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });

                                        fs.unlink(path, (err)=>{
                                            if(err){
                                                console.error(err)
                                                return
                                            }
                                        })
                                        
                                        if(message.typePromotion=="App"){
                                            MessageAppService.createBrouillonApp(message._id, client);
                                        }
                                        res.json({
                                            success: true,
                                            message:message
                                        }); 

                                    })
                                    
                                });
                                
                            } catch (error) {
                                next(error);
                            }

                        }else{

                            message.save(function(err,message){

                                if(err){
    
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
    
                                }else{

                                    if(message.typePromotion=="App"){
                                        MessageAppService.createBrouillonApp(message._id, client);
                                    }
                                    res.json({
                                        success: true,
                                        message:message
                                    });
                                }
                            })
                        }
                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            },

            createMessage(req,res,next){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let entreprise = await Entreprise.findOne({_id:req.params.id});
                        var code = Codes.generate({
                            length: 5,
                            count: 1,
                            charset: "0123456789"
                        });
                        code = code[0];

                        var message = new MessageClient(req.body);
                        message.entreprise = req.params.id;
                        message.dateCreated = new Date();
                        if(req.body.automatique){
                            message.automatique = req.body.automatique;
                        }else{
                            message.automatique = false; 
                        }
                        if(req.body.isCode){
                            message.isCode = req.body.isCode;
                            message.code = entreprise.nom+""+code;
                         }else{
                            message.isCode = false;
                         }

                        if(req.file){

                            try {

                                let path = "./public/" + req.file.filename;

                                fs.readFile(path,{encoding:'base64'}, async (err, data)=>{

                                    if(err){
                                        console.log("Erreur File", err);
                                    }
                                    
                                    message.photo = data;
                                    message.save(function(err, message){

                                        if(err){
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                        }else{

                                            fs.unlink(path, (err)=>{
                                                if(err){
                                                    console.error(err)
                                                    return
                                                }
                                            })    
                
                                            res.json({
                                                success: true,
                                                message:message
                                            });  

                                        }
                                               
                                    })
                                    
                                });
                                
                            } catch (error) {
                                next(error);
                            }

                        }else{

                            message.save(function(err,message){

                                if(err){
    
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
    
                                }else{
                                    res.json({
                                        success: true,
                                        message:message
                                    });
                                }
                            })
                        }
                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            },

            getMessageClient(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        MessageClient.findOne({_id:req.params.id},function(err,message){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:message
                                });
                            }
                        })

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            getMessageClientByType(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        MessageClient.findOne({type:req.params.type,entreprise:req.params.entreprise,etat:{$ne:"Brouillon"}},function(err,message){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{


                                res.json({
                                    success: true,
                                    message:message
                                });
                            }
                        })

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            deleteMessageClient(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let message = await MessageClient.findOne({_id:req.params.id});

                        message.delete(function(err,message){
                            if(err){
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }else{
                                res.json({
                                    success: true,
                                    message:message
                                });
                            }
                        })

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            updateMessageClient(req,res, next){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let message = await MessageClient.findOne({_id:req.params.id});
                        let entreprise = await Entreprise.findOne({_id:message.entreprise});
                        var code = Codes.generate({
                            length: 5,
                            count: 1,
                            charset: "0123456789"
                        });
                        code = code[0];

                        try {

                            message.nom = req.body.nom;
                            message.typePromotion = req.body.typePromotion;
                            message.message = req.body.message;
                            message.visite = req.body.visite;
                            message.automatique = req.body.automatique;
                            message.isCode = req.body.isCode;
                            if(!message.code && req.body.isCode){
                                message.code = entreprise.nom+""+code;
                            }

                            if(req.file){
                                try {

                                    let path = "./public/" + req.file.filename;
    
                                    fs.readFile(path,{encoding:'base64'}, async (err, data)=>{
    
                                        if(err){
                                            console.log("Erreur File", err);
                                        }
                                        
                                        message.photo = data;

                                        MessageClient.findOneAndUpdate({_id:req.params.id}, message,{ new: true },function(err, message){
                                            if(err){
                                                res.status(500).json({
                                                    success:false,
                                                    message:err
                                                })
                                            }else{

                                                fs.unlink(path, (err)=>{
                                                    if(err){
                                                        console.error(err)
                                                        return
                                                    }
                                                });

                                                res.status(200).json({
                                                    success:true,
                                                    message: message
                                                })
                                            }
                                        })
                                        
                                    });
                                    
                                } catch (error) {
                                    next(error);
                                }



                            }else{


                                MessageClient.findOneAndUpdate({_id:req.params.id},message,{ new: true },function(err,message){
                                    if(err){
    
                                        return res.status(500).json({
                                            success: false,
                                            message: err
                                        });
    
                                    }else{
    
                                        res.json({
                                            success: true,
                                            message:message
                                        });
    
                                    }
                                })

                            }
                        } catch (error) {
                            next(error);
                        }


                        
                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });

                    }
                })

            },

            deletePhoto(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let message = await MessageClient.findOne({_id:req.params.id});

                        message.photo = null;

                        MessageClient.findOneAndUpdate({_id:req.params.id},message,{ new: true },function(err,message){
                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:message
                                });

                            }
                        })



                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        }); 
                    }

                })
            }
        }
    }

})();