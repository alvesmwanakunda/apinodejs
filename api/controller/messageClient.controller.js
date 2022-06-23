(function(){

    "use strict";
    var MessageClient = require('../models/messageClient.model').MessageClientModel;

    module.exports = function(acl,app){

        return{

            createMessage(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        var message = new MessageClient(req.body);
                        message.entreprise = req.params.id;

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

                        MessageClient.findOne({type:req.params.type,entreprise:req.params.entreprise},function(err,message){

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

                        try {

                            message.nom = req.body.nom;
                            message.typePromotion = req.body.typePromotion;
                            message.message = req.body.message;
                            message.visite = req.body.visite;

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

            }
        }
    }

})();