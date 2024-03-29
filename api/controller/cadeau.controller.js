(function(){

    'use strict';
    var Cadeau = require('../models/cadeau.model').CadeauModel;
    var Operation = require('../models/operation.model').OperationModel;
    var CadeauClient = require('../models/cadeauClient.model').CadeauClientModel;

    module.exports = function(acl,app){

        return{

            createCadeau(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    if(aclres){

                        let cadeau = new Cadeau(req.body);
                        
                        if(!req.body.facture){
                            cadeau.facture=false;
                        }
                        if(!req.body.produit){
                            cadeau.produit=null;
                            cadeau.facture = req.body.facture;
                          }

                        cadeau.entreprise = req.params.id;
                        cadeau.typeCadeau = req.params.type;
                        cadeau.dateCreation = new Date();
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

            listCadeauByEntrepriseByType(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        Cadeau.find({entreprise:req.params.id,typeCadeau:req.params.type},function(err, cadeau){

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
                            cadeau.facture = req.body.facture;
                            cadeau.montant = req.body.montant;
                            cadeau.devise = req.body.devise;
                            cadeau.nombreLivraison = req.body.nombreLivraison;

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
            },

            getCadeauMobile(req,res){
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

                        }).populate('produit').populate('typesPoint');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }

                })
            },

            listCadeauByUserByEntrepriseByVisite(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                          let operation = await Operation.findOne({user:req.decoded.id,entreprise:req.params.id});
                          //client:{$ne:req.decoded.id}
                          //console.log("Operation", operation);

                          if(operation){

                            Cadeau.find({entreprise:req.params.id,point:{$lte:operation.point}},function(error, cadeau){

                                if(error){
                                    res.status(500).json({
                                        success:false,
                                        cadeau:err
                                    })
    
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        cadeau: cadeau
                                    })
                                }
                              }).populate('typesPoint').populate('produit');

                          }else{
                            res.status(200).json({
                                success:true,
                                cadeau: "Pas de cadeaux"
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

            listCadeauByUserByEntrepriseByAchat(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                          let operation = await Operation.findOne({user:req.decoded.id,entreprise:req.params.id});

                          Cadeau.find({entreprise:req.params.id,point:{$gte:operation.achat},client:{$ne:req.decoded.id}},function(error, cadeau){

                            if(error){
                                res.status(500).json({
                                    success:false,
                                    cadeau:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    cadeau: cadeau
                                })
                            }
                          }).populate('typesPoint').populate('produit');
                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        }); 
                    }
                })

            },

            lengthCadeauByEntreprise(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let cadeau = Cadeau.find({entreprise: req.params.id});

                        cadeau.count(function(err, count){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    cadeau:err
                                })
    
                            }else{
                                res.status(200).json({
                                    success:true,
                                    cadeau: count
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

            // Detail web recompense 

            listCadeauWebByUserByEntrepriseByVisite(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                          let operation = await Operation.findOne({user:req.params.id,entreprise:req.params.idEntreprise});
                          //client:{$ne:req.decoded.id}
                          //console.log("Operation", operation);

                          if(operation){

                            Cadeau.find({entreprise:req.params.idEntreprise,point:{$lte:operation.point},client:{$ne:req.params.id}},function(error, cadeau){

                                if(error){
                                    res.status(500).json({
                                        success:false,
                                        cadeau:err
                                    })
    
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        cadeau: cadeau
                                    })
                                }
                              }).populate('typesPoint').populate('produit');

                          }else{
                            res.status(200).json({
                                success:true,
                                cadeau: []
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

            listCadeauClient:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        CadeauClient.find({client:req.params.id,entreprise:req.params.entreprise},function(error,cadeau){

                            if(error){

                                res.status(500).json({
                                    success:false,
                                    message:error
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: cadeau
                                })
                            }

                        }).populate('cadeau').populate({path:'cadeau', populate:{path:'produit'}}).populate({path:'cadeau', populate:{path:'typesPoint'}});

                    }
                    else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }

                })
            }


            //Post.aggregate([{$match: {postId: 5}}, {$project: {upvotes: {$size: '$upvotes'}}}])

        }
    }

})();