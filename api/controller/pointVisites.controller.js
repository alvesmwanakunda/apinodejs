(function(){

    'use strict';
     var PointVisites = require('../models/pointVisites.model').PointVisitesModel;

     module.exports = function(acl,app){

        return{

            createPointVisite(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let pointVisite = new PointVisites(req.body);
                        pointVisite.entreprise = req.params.id;
                        pointVisite.save(function(error, pointVisite){

                            if(error){
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }else{
                                res.json({
                                    success: true,
                                    message:pointVisite
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
            
            listPointVisiteByEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        PointVisites.find({entreprise:req.params.id},function(err, pointVisite){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:pointVisite
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

            updatePointVisite(req,res, next){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let pointVisite = await PointVisites.findOne({_id:req.params.id});

                        try {

                            pointVisite.point = req.body.point;
                            pointVisite.typesPoint = req.body.typesPoint;

                            PointVisites.findOneAndUpdate({_id:req.params.id},pointVisite,{new:true},function(err, pointVisite){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        message: pointVisite  
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

            removePointVisite(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let pointVisite = await PointVisites.findOne({_id:req.params.id});
                        pointVisite.remove(function(err, pointVisite){
                            if(err){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: pointVisite
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

            getPointVisite(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        PointVisites.findOne({_id:req.params.id}, function(error, pointVisite){
                            if(error){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: pointVisite
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