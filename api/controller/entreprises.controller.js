(function(){

    'use strict';
    var entrepriseService = require('../services/entreprises.service');
    var Entreprise = require('../models/entreprises.model').EntrepriseModel;
    var fs = require("fs");


    module.exports = function(acl, app){

        return {
            
            getUserByEntreprise(req, res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){

                   if(aclres){

                        try {
                            let entreprise = await entrepriseService.getEntrepriseByUser(req.decoded.id);
                            res.json(entreprise);
                        } catch (error) {
                            res.json(error);  
                        }

                   } else{

                       return res.status(401).json({
                           success: false,
                           message:"401"
                       })

                   }
                })
            },

            udpateEntreprise(req, res, next){
                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){

                    if(aclres){

                        let entreprise = await Entreprise.findOne({_id:req.params.id});

                        try {

                                entreprise.nom  = req.body.nom;
                                entreprise.phone1 = req.body.phone1;
                                entreprise.phone2 = req.body.phone2;
                                entreprise.adresse = req.body.adresse;
                                entreprise.description = req.body.description;
                                entreprise.categorie = req.body.categorie;
                                //entreprise.creation = new Date();
                                
                                Entreprise.findOneAndUpdate({_id:req.params.id}, entreprise,{ new: true },function(err, entreprise){
                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:err
                                        })
                                    }else{
                                        res.status(200).json({
                                            success:true,
                                            message: entreprise
                                        })
                                    }
                                })

                            
                        } catch (error) {
                            next(error);
                        }
      
                    } else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })
            },

            uploadLogo(req, res, next){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){
                    if(aclres){

                        let entreprise = await Entreprise.findOne({_id:req.params.id});
                        let photo;
                        //console.log("Body En", req.body);
                        //console.log("Body File", req.file);

                        try {

                                let path = "./public/" + req.file.filename;
                                fs.readFile(path,{encoding:'base64'}, async (err, data)=>{

                                    if(err){
                                        console.log("Erreur File", err);
                                    }
                                    //let base64 = data.toString('base64');
                                    //photo = new Buffer(base64, 'base64');
                                    //console.log("Data", data);
                                    entreprise.image = data;
                                    
                                    Entreprise.findOneAndUpdate({_id:req.params.id}, entreprise,{ new: true },function(err, entreprise){
                                        if(err){
                                            res.status(500).json({
                                                success:false,
                                                message:err
                                            })
                                        }else{

                                            fs.unlink(path, (err)=>{
                                                if(err){
                                                    console.error(err)
                                                    return
                                                }
                                            })
                                            res.status(200).json({
                                                success:true,
                                                message: entreprise
                                            })
                                        }
                                    })
                                }); 
                            
                        } catch (error) {
                            next(error);
                        }

                    }else{

                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            },

            getEntrepriseByCategorie(req, res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){

                    if(aclres){

                        Entreprise.find(function(error, entreprises){

                            if(error){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: entreprises
                                })
                            }
                        }).limit(5)
                    }else{
                        return res.status(401).json({
                            success:false,
                            message:"401"
                        })
                    }
                })

            },

            getEntrepriseByUserVisiter(req, res){

                        Entreprise.find(function(error, entreprises){

                            if(error){
                                res.status(500).json({
                                    success:false,
                                    message:error
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: entreprises
                                })
                            }
                        }).limit(5)
            },

            getEntrepriseByIdVisiteur(req,res){

                Entreprise.findOne({_id:req.params.id},function(err, entreprise){

                    if(err){

                        res.status(500).json({
                            success:false,
                            message:error
                        })

                    }else{
                        res.status(200).json({
                            success:true,
                            message: entreprise
                        })
                    }
                })
            },

            getEntrepriseById(req,res){

                acl.isAllowed(req.decoded.id, 'clients','create', async function(err, aclres){

                    if(aclres){

                        Entreprise.findOne({_id:req.params.id},function(err, entreprise){

                            if(err){

                                res.status(500).json({
                                    success:false,
                                    message:error
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: entreprise
                                })
                            }
                        })

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