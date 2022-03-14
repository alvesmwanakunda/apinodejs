(function(){

    'use strict';
    var Cadeau = require('../models/cadeau.model').CadeauModel;

    module.exports = function(acl,app){

        return{

            createCadeau(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    if(aclres){

                        let cadeau = new Cadeau(req.body);
                        cadeau.entreprise = req.params.id;
                        cadeau.save(function(err, cadeau){

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

            listCadeauByEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        Cadeau.find({entreprise:req.params.id},function(err, cadeau){

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

                        }).populate('produit').populate('typesPoint');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });

                    }
                })
            },

            updateCadeau(req,res, next){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let cadeau = await Cadeau.findOne({_id:req.params.id});

                        try {

                            cadeau.point = req.body.point;
                            cadeau.typesPoint = req.body.typesPoint;
                            cadeau.produit = req.body.produit;
                            cadeau.dateDebut = req.body.dateDebut;
                            cadeau.dateFin = req.body.dateFin;

                            Cadeau.findOneAndUpdate({_id:req.params.id},cadeau,{new:true},function(err, cadeau){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        message: cadeau
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

            removeCadeau(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let cadeau = await Cadeau.findOne({_id:req.params.id});
                        cadeau.remove(function(err, cadeau){
                            if(err){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: cadeau
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

            getCadeau(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Cadeau.findOne({_id:req.params.id}, function(error, cadeau){
                            if(error){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: cadeau
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