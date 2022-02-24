(function(){
    "use strict";
    var Horaire = require('../models/horaire.model').HoraireModel;

    module.exports = function(acl,app){
        return{

            createHoraire(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        //console.log("Body", req.body);

                        Horaire.findOne({entreprise:req.params.id},function(err, entrepriseexists){

                            if(err)
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            if(entrepriseexists){

                                Horaire.findOneAndUpdate({entreprise:req.params.id}, req.body,{ new: true },function(err, horaire){
                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:err
                                        })
                                    }else{
                                        res.status(200).json({
                                            success:true,
                                            message: horaire
                                        })
                                    }
                                })
                                
                            }
                            else{

                                req.body.entreprise = req.params.id;
                                var horaire = new Horaire(req.body);
                                horaire.save(function(err, horaire){
                                    if(err){
                                        return res.status(500).json({
                                            success: false,
                                            message: err
                                        });
                                    }
                                    else{
                                        res.json({
                                            success: true,
                                            message:horaire
                                        });
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

            getHoraireByEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    if(aclres){

                        Horaire.findOne({entreprise:req.params.id}, function(err, horaire){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: horaire
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