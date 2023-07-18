(function(){

    "use strict";
    var MessageApp = require('../models/messageApp.model').MessageAppModel;
    var ObjectId = require('mongoose').Types.ObjectId;
    var Entreprise = require('../models/entreprises.model').EntrepriseModel;
    var messageAppService = require('../services/messageApp.service');
    var Promotion = require('../models/promotions.model').PromotionsModel;
    var MessageClient = require('../models/messageClient.model').MessageClientModel;


    module.exports = function(acl,app){

        return{

            listeCountMessageByEntreprise:function(req, res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                       /* MessageApp.aggregate([
                            {"$match":{client:new ObjectId(req.params.id)}},
                            {"$group":{
                                _id:"$entreprise",
                                date:{"$last":"$dateCreated"},
                                nombre:{$sum:1},
                            }},
                            {"$lookup":{
                               "from":"entreprises",
                               "localField":"entreprise",
                               "foreignField":"entreprise",
                               "as":"entreprise"
                            }}
                        ],function(err,message){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: message
                                })
                            }

                        })
                      */

                        MessageApp.aggregate([
                            {"$match":{client:new ObjectId(req.params.id)}},
                            {$unwind: '$entreprise'},
                            {"$group":{
                                _id:"$entreprise",
                                date:{"$last":"$dateCreated"},
                                nombre:{$sum:{$cond:[{$eq:["$lire",false]},1,0]}},
                            }},
                        ]).exec(function(err, message){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }else{
                               
                                Entreprise.populate(message,{path:'_id'},function(err, messageApp){

                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:err
                                        })
                                    }else{
                                        res.status(200).json({
                                            success:true,
                                            message: messageApp
                                        })
                                    }
                                })
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

            listByMessageClient:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        MessageApp.find({client:req.params.id,entreprise:req.params.idEntreprise},function(err,message){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }else{
                                messageAppService.updateManyMessage(req.params.id,req.params.idEntreprise);
                                res.status(200).json({
                                    success:true,
                                    message: message
                                })
                            }

                        }).populate('message').populate('promotion');

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }


                })

            },

            deleteManyMessageClient:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let messages = req.body;

                        MessageApp.deleteMany({
                          client:{$in:messages.map(function(obj){return new ObjectId(obj.client)})},
                          entreprise:{$in:messages.map(function(obj){return new ObjectId(obj.entreprise)})}   
                        }, function(err, message){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: message
                                })
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

            getCountMessageUser:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let message = MessageApp.find({client: req.params.id,lire:false});

                        message.count(function(err, count){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    depense:err
                                })
    
                            }else{
                                res.status(200).json({
                                    success:true,
                                    depense: count
                                })
                            }
                        })    
                    }
                    else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }

                })   

            },

            getMessageByQrcode:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let message = await MessageApp.findOne({_id: req.params.id,entreprise:req.params.entreprise});

                        //console.log("Message", message);

                        if(message){
                            res.status(200).json({
                                success:true,
                                message: "Code promotion approuve"
                            })
                        }else{
                            res.status(500).json({
                                success:false,
                                message:"Code promotion non approuve"
                            })
                        }   
                    }
                    else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }

                }) 
            },

            messageFormulaireQrcode(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let isPromo = req.body.code.includes("PROMO");

                        if(isPromo){

                            let promotion = await Promotion.findOne({entreprise:req.params.entreprise, code:req.body.code});
                            if(promotion){
                                res.status(200).json({
                                    success:true,
                                    message: "Code promotion approuve"
                                })
                            }else{
                                res.status(200).json({
                                    success:false,
                                    message:"Code promotion non approuve"
                                })
                            } 
                        }else{
                            let message = await MessageClient.findOne({entreprise:req.params.entreprise, code:req.body.code});
                            if(message){
                                res.status(200).json({
                                    success:true,
                                    message: "Code promotion approuve"
                                })
                            }else{
                                res.status(200).json({
                                    success:false,
                                    message:"Code promotion non approuve"
                                })
                            }  

                        }

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