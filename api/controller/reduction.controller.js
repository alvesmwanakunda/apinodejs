(function(){

    'use strict';
    var Reduction = require('../models/reduction.model').ReductionModel;

    module.exports = function(acl,app){

        return{

            createReduction(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    if(aclres){

                        let reduction = new Reduction(req.body);
                        reduction.entreprise = req.params.id;
                        reduction.dateCreation = new Date();
                        reduction.save(function(err, reduction){

                            if(err){
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }else{
                                res.json({
                                    success: true,
                                    message:reduction
                                });
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

            listReductionByEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        Reduction.find({entreprise:req.params.id},function(err, reduction){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:reduction
                                });

                            }

                        }).populate('produit').populate('typesPoint');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });

                    }
                })
            },

            updateReduction(req,res, next){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let reduction = await Reduction.findOne({_id:req.params.id});

                        try {

                            reduction.point = req.body.point;
                            reduction.montant = req.body.montant;
                            reduction.typesPoint = req.body.typePoint;
                            reduction.produit = req.body.produit;

                            Reduction.findOneAndUpdate({_id:req.params.id},reduction,{new:true},function(err, reduction){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        message: reduction
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

            removeReduction(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let reduction = await Reduction.findOne({_id:req.params.id});
                        reduction.remove(function(err, reduction){
                            if(err){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: reduction
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

            getReduction(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){
                          Reduction.findOne({_id:req.params.id},function(error, reduction){
                            if(error){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: reduction
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