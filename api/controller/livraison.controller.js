(function(){

    'use strict';
    var Livraison = require('../models/livraison.model').LivraisonModel;

    module.exports = function(acl,app){

        return{

            createLivraison(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let livraison = new Livraison(req.body);
                        livraison.entreprise = req.params.id;
                        livraison.save(function(error, livraison){

                            if(error){
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }else{
                                res.json({
                                    success: true,
                                    message:livraison
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
            listLivraisonByEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        Livraison.find({entreprise:req.params.id},function(err, cadeau){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:cadeau
                                });

                            }

                        }).populate('typesPoint');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });

                    }
                })
            },

            updateLivraison(req,res, next){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let livraison = await Livraison.findOne({_id:req.params.id});

                        try {

                            livraison.point = req.body.point;
                            livraison.typesPoint = req.body.typesPoint;

                            Livraison.findOneAndUpdate({_id:req.params.id},livraison,{new:true},function(err, livraison){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        message: livraison  
                                    })
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
            },

            removeLivraison(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let livraison = await Livraison.findOne({_id:req.params.id});
                        livraison.remove(function(err, livraison){
                            if(err){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: livraison
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

            getLivraison(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Livraison.findOne({_id:req.params.id}, function(error, livraison){
                            if(error){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: livraison
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
            }
        }
    }


})();