(function(){
    "use strict";
    var Connexion = require('../models/connexion.model').ConnexionModel;
    var ObjectId = require('mongoose').Types.ObjectId;


    module.exports = function(acl,app){

        return{

            addConnexion:function(req,res){

                console.log("Connexion", req.body);

                var connexion = new Connexion();
                connexion.users = new ObjectId(req.body.user);
                connexion.entreprises = new ObjectId(req.body.entreprise);
                connexion.connexion = new Date();

                connexion.save(function(err,connexion){
                    if(err){
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }else{
                        res.json({
                            success: true,
                            message:connexion
                        });
                    }
                })
            },

            updateConnexion:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){

                    if(aclres){

                        let connexion = await Connexion.findOne({user:req.decoded.id},{sort:{'connexion':-1}});
                        console.log("Last connexion", connexion);
                        connexion.deconnexion = new Date();

                        //{_id:req.decoded.id},user,{new:true}
                        Connexion.findOneAndUpdate({user:req.decoded.id},connexion,{new:true},function(error, connexion){
                            if(error){

                                return res.status(500).json({
                                    success:false,
                                    message: error
                                });
                            }else{
                                res.json({
                                    success:true,
                                    message:connexion
                                });
                            }
                        })

                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })
            },

            listConnexion:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){

                    if(aclres){
                        Connexion.find({entreprise:req.params.id},function(err, connexion){

                            if(err){
                                return res.status(500).json({
                                    success:false,
                                    message: err
                                });
                            }else{
                                res.json({
                                    success:true,
                                    message:connexion
                                });
                            }
                        }).populate('user');
                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            }
        }
    }

})();