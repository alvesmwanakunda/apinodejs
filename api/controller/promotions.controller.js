(function(){

    'use strict';
    var Promotion = require('../models/promotions.model').PromotionsModel;
    var Entreprise = require('../models/entreprises.model').EntrepriseModel;
    var messageApp = require('../services/messageApp.service');
    var fs = require("fs");
    var Codes = require('voucher-code-generator');


    module.exports = function(acl, app){

        return{

            lisPromotions(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){

                    if(aclres){

                        Promotion.find({entreprise:req.params.id}, function(err, promotions){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: promotions
                                })
                            }
                        })

                    }else{
                        return res.status(401).json({
                            success: false,
                            message:"401"
                        })
                    }
                });
            },

            getPromotion(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){

                    if(aclres){

                        Promotion.findOne({_id:req.params.id},function(err, promotion){

                            if(err){
                                res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: promotion
                                })
                            }

                        })
                    }else{

                        return res.status(401).json({
                            success: false,
                            message:"401"
                        })
                    }
                });    
            },

            createPromotion(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){

                    if(aclres){

                        let entreprise = await Entreprise.findOne({_id:req.params.id});
                        var code = Codes.generate({
                            length: 5,
                            count: 1,
                            charset: "0123456789"
                        });
                        code = code[0];

                        var promotion = new Promotion(req.body);
                        if(req.body.age1){
                            promotion.age1 = req.body.age1;
                        }
                        if(req.body.age2){
                              promotion.age2 = req.body.age2;
                        }
                        promotion.entreprise = req.params.id;

                        if(req.body.jours){
                            promotion.dateEnvoie = req.body.jours;
                        }else{
                            promotion.dateEnvoie = new Date();
                        }
                        if(req.body.isCode){
                            promotion.isCode = req.body.isCode;
                            promotion.code = "PROMO"+""+code;
                         }else{
                            promotion.isCode = false;
                         }
                       

                        if(req.file){

                            try {

                                let path = "./public/" + req.file.filename;

                                fs.readFile(path,{encoding:'base64'}, async (err, data)=>{

                                    if(err){
                                        console.log("Erreur File", err);
                                    }
                                    
                                    promotion.photo = data;
                                    promotion.save(function(err, promotion){

                                        if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });

                                        fs.unlink(path, (err)=>{
                                            if(err){
                                                console.error(err)
                                                return
                                            }
                                        });


                                        if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                            messageApp.createPromotionApp(promotion);
                                        }else if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                             messageApp.createPromotionAppWifed(promotion);
                                        }
                                        else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                            messageApp.createPromotionSms(promotion);
                                        } 
                                        else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                            messageApp.createPromotionSmsWifed(promotion);
                                        } 
                                        res.json({
                                            success: true,
                                            message:promotion
                                        });     
                                    })
                                    
                                });
                                
                            } catch (error) {
                                next(error);
                            }

                        }else{

                            promotion.save(function(err, promotion){

                                if(err)
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                    
                                if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                    messageApp.createPromotionApp(promotion);
                                }else if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                    messageApp.createPromotionAppWifed(promotion);
                                }
                                else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                    messageApp.createPromotionSms(promotion);
                                } 
                                else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                    messageApp.createPromotionSmsWifed(promotion);
                                }     
                                res.json({
                                    success: true,
                                    message:promotion
                                });     
                            })

                        }

                    }else{
                        return res.status(401).json({
                            success: false,
                            message:"401"
                        }) 
                    }

                });
            },

            deletePromotion(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){

                    if(aclres){

                        let promotion = await Promotion.findOne({_id:req.params.id});

                        promotion.delete(function(err, promotion){

                            if(err)
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            res.json({
                                success: true,
                                message:promotion
                            });     
                        })


                    }else{

                        return res.status(401).json({
                            success: false,
                            message:"401"
                        })
                    }

                });
            },

            updatePromotion(req,res,next){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){

                    if(aclres){

                        let promotion = await Promotion.findOne({_id:req.params.id});

                        try {
                            promotion.nom = req.body.nom;
                            promotion.types = req.body.types;
                            promotion.sms = req.body.sms;
                            promotion.email = req.body.email;
                            promotion.cible = req.body.cible;
                            promotion.critere = req.body.critere;
                            promotion.jours = req.body.jours;
                            promotion.heure = req.body.heure;
                            promotion.condition = req.body.condition;
                            promotion.interval1 = req.body.interval1;
                            promotion.interval2 = req.body.interval2;
                            if(req.body.age1){
                              promotion.age1 = req.body.age1;
                            }
                            if(req.body.age2){
                                promotion.age2 = req.body.age2;
                            }
                            //promotion.age1 = req.body.age1;
                            //promotion.age2 = req.body.age2;
                            promotion.sexe = req.body.sexe;
                            promotion.region = req.body.region;
                            promotion.zone = req.body.zone;
                            promotion.nombre = req.body.nombre;
                            promotion.etat = req.body.etat;

                            if(req.body.isCode){
                                promotion.isCode = req.body.isCode;
                                promotion.code = "PROMO"+""+code;
                             }else{
                                promotion.isCode = false;
                             }


                            if(req.file){

                                try {

                                    let path = "./public/" + req.file.filename;
    
                                    fs.readFile(path,{encoding:'base64'}, async (err, data)=>{
    
                                        if(err){
                                            console.log("Erreur File", err);
                                        }
                                        
                                        promotion.photo = data;

                                        Promotion.findOneAndUpdate({_id:req.params.id}, promotion,{ new: true },function(err, promotion){
                                            if(err){
                                                res.status(500).json({
                                                    success:false,
                                                    message:err
                                                })
                                            }else{


                                                if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                                    messageApp.createPromotionApp(promotion);
                                                }else if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                                    messageApp.createPromotionAppWifed(promotion);
                                                }
                                                else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                                    messageApp.createPromotionSms(promotion);
                                                } 
                                                else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                                    messageApp.createPromotionSmsWifed(promotion);
                                                }   

                                                res.status(200).json({
                                                    success:true,
                                                    message: promotion
                                                })
                                            }
                                        })
                                        
                                    });
                                    
                                } catch (error) {
                                    next(error);
                                }

                            }
                            else{

                                Promotion.findOneAndUpdate({_id:req.params.id}, promotion,{ new: true },function(err, promotion){
                                    if(err){
                                        res.status(500).json({
                                            success:false,
                                            message:err
                                        })
                                    }else{

                                        if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                            messageApp.createPromotionApp(promotion);
                                        }else if(promotion.types=="App" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                            messageApp.createPromotionAppWifed(promotion);
                                        }
                                        else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Mes clients" && promotion.etat=="envoyée"){
                                            messageApp.createPromotionSms(promotion);
                                        } 
                                        else if(promotion.types=="Sms" && promotion.critere=="Instantanné" && promotion.cible=="Utilisateur Wefid" && promotion.etat=="envoyée"){
                                            messageApp.createPromotionSmsWifed(promotion);
                                        }   

                                        res.status(200).json({
                                            success:true,
                                            message: promotion
                                        })
                                    }
                                })

                            }
                            
                        } catch (error) {
                             next(error);
                        }



                    }else{
                       
                        return res.status(401).json({
                            success: false,
                            message:"401"
                        })
                    }

                })


            }

        }
    }

})();