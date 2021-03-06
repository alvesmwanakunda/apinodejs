(function(){

    "use strict";
    var Operation = require('../models/operation.model').OperationModel;
    var PointVisite = require('../models/pointVisites.model').PointVisitesModel;
    var Budget = require('../models/budget.model').BudgetModel;
    var Cadeau = require('../models/cadeau.model').CadeauModel;
    var CadeauClient = require('../models/cadeauClient.model').CadeauClientModel;
    var Entreprises = require('../models/entreprises.model').EntrepriseModel;
    var Depense = require('../models/depense.model').DepenseModel;
    var Encaisse = require('../models/encaisse.model').EncaisseModel;
    var Client = require('../models/clients.model').ClientsModel;
    var AvoirDepense = require('../models/avoirDepense.model').AvoirDepenseModel;
    var AvoirEncaisse = require('../models/avoirEncaisse.model').AvoirEncaisseModel;
    var operationService = require('../services/operation.service');
    var ObjectId = require('mongoose').Types.ObjectId;


    module.exports = function(acl,app){

        return{

            listeOperationByEntreprise:function(req, res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let operations = await operationService.listOperationByEntreprise(req.params.id);
                        res.json({
                            success: true,
                            message: operations
                        });
                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })

            },
            
            getOperationByClient:function(req,res) {

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                 
                    if(aclres){

                        let operation = await Operation.findOne({client:req.params.id});
                        res.json({
                            success: true,
                            message: operation
                        });

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }

                })
            },

            listOperationByClient:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    //console.log("id",req.decoded.id);
                    
                    if(aclres){

                        Operation.find({user:new ObjectId(req.decoded.id)}, function(error, operations){

                            if(error){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: operations
                                })
                            }

                        }).populate('entreprise');

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            //addPointVisite

            addPointVisite:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let operation = await Operation.findOne({user:req.params.id, entreprise:req.params.entreprise});
                        let pointVisite = await PointVisite.findOne({entreprise:req.params.entreprise});
                        let client = await Client.findOne({user:req.params.id});
                        let type="Visites";

                        if(operation){

                            operation.visite = parseInt(operation.visite) + parseInt(pointVisite.point);
                            operation.fin = new Date();
                            operation.point = parseInt(operation.point) + parseInt(pointVisite.point),
                            operation.nombreVisite = parseInt(operation.nombreVisite) + 1;

                            Operation.findOneAndUpdate({_id:new ObjectId(operation._id)},operation,{new:true},function(error,operation){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:error
                                    })
                                }else{
                                    operationService.addEncaisse(req.params.id,req.params.entreprise,pointVisite.point,type);
                                    res.status(200).json({
                                        success:true,
                                        message: operation
                                    })
                                }
                            })

                        }else{

                            let op = new Operation();
                            op.entreprise = new ObjectId(req.params.entreprise);
                            op.client= new ObjectId(client._id);
                            op.user= new ObjectId(req.params.id);
                            op.creation = new Date(); 
                            op.debut = new Date(); 
                            op.fin = new Date();

                            op.visite = pointVisite.point;
                            op.fin = new Date();
                            op.point =pointVisite.point;
                            op.nombreVisite =1;

                            op.save(function(err, operation){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:error
                                    })
                                }else{
                                    operationService.addEncaisse(req.params.id,req.params.entreprise,pointVisite.point,type);
                                    res.status(200).json({
                                        success:true,
                                        message: operation
                                    })
                                }
                            })
                            //operationService.addOperationByEntrepise(req.params.entreprise,client._id,req.params.id);

                        }

                            

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }

                })
            },

            //addAchat

            addAchat:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){


                    if(aclres){

                        let operation = await Operation.findOne({user:req.params.id, entreprise:req.params.entreprise});
                        let budget = await Budget.findOne({entreprise:req.params.entreprise});
                        let type ="Achats";
                        let client = await Client.findOne({user:req.params.id});


                        console.log("Montant", req.body.montant);

                        if(operation){

                            if(req.body.montant>=budget.achat){

                                operation.achat = parseInt(operation.achat) + parseInt(budget.point);
                                operation.fin = new Date();
                                operation.point = parseInt(operation.point) + parseInt(budget.point);
                                operation.montantAchat = parseInt(operation.montantAchat) + parseInt(req.body.montant);
                                operation.depense =  parseInt(operation.depense) + parseInt(req.body.montant);
    
                                Operation.findOneAndUpdate({_id:new ObjectId(operation._id)},operation,{new:true},function(error,operation){
                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:error
                                        })
                                    }else{
    
                                        operationService.addEncaisse(req.params.id,req.params.entreprise,budget.point,type);
                                        res.status(200).json({
                                            success:true,
                                            message: operation
                                        })
                                    }
                                })
    
                            }else{

                                operation.fin = new Date();
                                operation.montantAchat = parseInt(operation.montantAchat) + parseInt(req.body.montant);
                                operation.depense =  parseInt(operation.depense) + parseInt(req.body.montant);
    
                                Operation.findOneAndUpdate({_id:new ObjectId(operation._id)},operation,{new:true},function(error,operation){
                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:error
                                        })
                                    }else{
    
                                        operationService.addEncaisse(req.params.id,req.params.entreprise,budget.point,type);
                                        res.status(200).json({
                                            success:true,
                                            message: operation
                                        })
                                    }
                                })
                           }
                        }
                        else{

                            if(req.body.montant>=budget.achat){

                                let op = new Operation();
                                op.achat=budget.point;
                                op.montantAchat = req.body.montant;
                                op.fin = new Date();
                                op.client= new ObjectId(client._id);
                                op.point=budget.point;
                                op.user = new ObjectId(req.params.id);
                                op.entreprise = new ObjectId(req.params.entreprise);

                                op.save(function(err,operation){


                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:err
                                        })
                                    }else{
    
                                        operationService.addEncaisse(req.params.id,req.params.entreprise,budget.point,type);
                                        res.status(200).json({
                                            success:true,
                                            message: operation
                                        })
                                    }
                                })

                            }else{

                                let op = new Operation();
                                op.montantAchat = req.body.montant;
                                op.fin = new Date();
                                op.client= new ObjectId(client._id);
                                op.depense=req.body.montant;
                                op.user = new ObjectId(req.params.id);
                                op.entreprise = new ObjectId(req.params.entreprise);

                                op.save(function(err,operation){


                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:err
                                        })
                                    }else{
    
                                        operationService.addEncaisse(req.params.id,req.params.entreprise,budget.point,type);
                                        res.status(200).json({
                                            success:true,
                                            message: operation
                                        })
                                    }
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

            },

            //addCadeau

            addCadeau:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let operation = await Operation.findOne({user:req.params.id, entreprise:req.params.entreprise});
                        let cadeau = await Cadeau.findOne({_id:new ObjectId(req.params.cadeau)}).populate("typesPoint");
                        let entreprise = await Entreprises.findOne({_id:new ObjectId(req.params.entreprise)});

                        //console.log("Cadeau", cadeau.entreprise);
                        //console.log("Entreprise", entreprise._id);

                        if(cadeau.entreprise.equals(entreprise._id)){

                            if(cadeau.typesPoint.nom=="Visites"){

                                operation.visite = parseInt(operation.visite) - parseInt(cadeau.point);
                                operation.point = parseInt(operation.point) - parseInt(cadeau.point);

                            }else{
                                operation.achat = parseInt(operation.achat) - parseInt(cadeau.point);
                                operation.point = parseInt(operation.point) - parseInt(cadeau.point);
                            }

                            Operation.findOneAndUpdate({_id:new ObjectId(operation._id)},operation,{new:true},function(error,operation){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:error
                                    })
                                }else{

                                    operationService.addCadeauClient(operation.client,cadeau._id,req.params.entreprise);
                                    operationService.addUserCadeau(cadeau._id,req.params.id);
                                    operationService.addDepense(req.params.id,req.params.entreprise,cadeau.produit,cadeau.point);

                                    res.status(200).json({
                                        success:true,
                                        operation: operation,
                                        message: "Votre code cadeau a ??t?? scann?? avec succ??s",
                                    })

                                }
                            })

                        }else{
                            
                            res.status(200).json({
                                success:true,
                                message: "Votre code cadeau ne correspond pas a nos codes cadeau"
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


            //Operation avoir

            addAvoir:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let operation = await Operation.findOne({user:req.params.id, entreprise:req.params.entreprise});

                        if(operation){
                            operation.avoir = parseInt(operation.avoir) + parseInt(req.body.montant);
                            operation.fin = new Date();

                            Operation.findOneAndUpdate({_id:new ObjectId(operation._id)},operation,{new:true},function(error,operation){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:error
                                    })
                                }else{

                                    operationService.addAvoirEncaisse(req.params.id,req.params.entreprise,req.body.montant);
                                    res.status(200).json({
                                        success:true,
                                        message: operation
                                    })
                                }
                            })


                        }else{

                                let op = new Operation();
                                op.avoir=req.body.montant;
                                op.fin = new Date();
                                op.user = new ObjectId(req.params.id);
                                op.entreprise = new ObjectId(req.params.entreprise);

                                op.save(function(err,operation){

                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:error
                                        })
                                    }else{
                                        operationService.addAvoirEncaisse(req.params.id,req.params.entreprise,req.body.montant);
                                        res.status(200).json({
                                            success:true,
                                            message: operation
                                        })
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

            lengthAvoirDepense:function(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let depense = AvoirDepense.find({entreprise: req.params.id,user:req.decoded.id});

                        depense.count(function(err, count){

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

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });  
                    }
                })

            },

            lengthAvoirEncaisse:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let encaisse = AvoirEncaisse.find({entreprise: req.params.id,user:req.decoded.id});

                        encaisse.count(function(err, count){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    encaisse:err
                                })
    
                            }else{
                                res.status(200).json({
                                    success:true,
                                    encaisse: count
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

            addAvoirDepense:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let encaisse = await AvoirEncaisse.findOne({_id:req.params.id});
                        let entreprise = await Entreprises.findOne({_id:req.params.entreprise});

                        let operation = Operation.findOne({user:encaisse.user,entreprise:entreprise._id});

                        operation.avoir = parseInt(operation.avoir) - parseInt(encaisse.montant);
                        operation.fin = new Date();

                        if(encaisse.entreprise.equals(entreprise._id)){

                            Operation.findOneAndUpdate({_id:new ObjectId(operation._id)},operation,{new:true},function(error,operation){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:error
                                    })
                                }else{
    
                                    operationService.addAvoirDepense(encaisse.user,encaisse.entreprise,encaisse.montant);
                                    operationService.deleteAvoirEncaisse(req.params.id);
                                    res.status(200).json({
                                        success:true,
                                        operation: operation,
                                        message: "Votre avoir a ??t?? scann?? avec succ??s",
                                    })
                                }
                            })

                        }else{

                            res.status(200).json({
                                success:true,
                                message: "Votre code avoir ne correspond pas a nos codes avoirs"
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

            listAvoirDepense:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        AvoirDepense.find({user:req.decoded.id,entreprise:req.params.id},function(err,depense){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message:depense
                                })
                            }
                        }).populate('entreprise');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            listAvoirEncaisse:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        AvoirEncaisse.find({user:req.decoded.id,entreprise:req.params.id},function(err,encaisse){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message:encaisse
                                })
                            }
                        }).populate('entreprise');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            getAvoirEncaisse:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                     AvoirEncaisse.findOne({_id:req.params.id},function(err, encaisse){

                        if(err){
                            res.status(500).json({
                                success:false,
                                message:error
                            })
                        }else{
                            res.status(200).json({
                                success:true,
                                message:encaisse
                            })
                        }
                     });

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            // Fin avoir

            listCadeauEntreprise:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        CadeauClient.find({entreprise:req.params.id},function(err, cadeau){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message:cadeau,
                                })
                            }
                        }).populate('cadeau').populate('client');

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            listDepense:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Depense.find({user:req.decoded.id,entreprise:req.params.id},function(err,depense){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message:depense
                                })
                            }
                        }).populate('produit').populate('entreprise');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            listEncaisse:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Encaisse.find({user:req.decoded.id,entreprise:req.params.id},function(err,encaisse){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message:encaisse
                                })
                            }
                        }).populate('entreprise');

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            lengthDepense:function(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let depense = Depense.find({entreprise: req.params.id,user:req.decoded.id});

                        depense.count(function(err, count){

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

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });  
                    }
                })

            },

            lengthEncaisse:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let encaisse = Encaisse.find({entreprise: req.params.id,user:req.decoded.id});

                        encaisse.count(function(err, count){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    encaisse:err
                                })
    
                            }else{
                                res.status(200).json({
                                    success:true,
                                    encaisse: count
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

            //length point entreprise

            lengthPointByEntreprise:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Operation.aggregate([
                            {$match:{entreprise:new ObjectId(req.params.id)}},
                            {$group: {_id:null, point:{$sum:"$point"}}}
                        ],function(err,operation){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    operation:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    operation: operation
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

            lengthAchatByEntreprise:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Operation.aggregate([
                            {$match:{entreprise:new ObjectId(req.params.id)}},
                            {$group: {_id:null, achat:{$sum:"$achat"}}}
                        ],function(err,operation){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    operation:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    operation: operation
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

            listDepenseByEntreprise:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Depense.find({entreprise:req.params.id},function(err,depense){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message:depense
                                })
                            }
                        }).populate('produit').populate('client');

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            lengthDepenseByEntreprise:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Operation.aggregate([
                            {$match:{entreprise:new ObjectId(req.params.id)}},
                            {$group: {_id:null, point:{$sum:"$point"}}}
                        ],function(err,operation){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    operation:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    operation: operation
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

        }
    }

})();