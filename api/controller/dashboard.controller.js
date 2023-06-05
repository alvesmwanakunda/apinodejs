(function(){

    "use strict";
    var Client = require('../models/clients.model').ClientsModel;
    var clientService = require('../services/clients.service');
    var ObjectId = require('mongoose').Types.ObjectId;
    var Operation = require('../models/operation.model').OperationModel;
    var Promotion = require('../models/promotions.model').PromotionsModel;
    var Message = require('../models/messageApp.model').MessageAppModel;


    module.exports = function(acl, app){

        return{

            getAllInfosClient(req, res){
                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){
                    if(aclres){

                        //var now = new Date();
                        //let monthNow = (now.getMonth()+1);
                        //let yearNow = now.getFullYear();
                        let nbVisite=0;
                        

                        let clients = await Client.find({entreprise:new ObjectId(req.params.id)});
                        //let newClient = await Operation.find({entreprise:new ObjectId(req.params.id),nombreVisite:{$eq:0, $lte:5}});
                        let newClient = await Operation.find({entreprise:new ObjectId(req.params.id),creation:{ $eq: new Date() }});
                        //let relanceClient = await Operation.find({$and:[{entreprise:new ObjectId(req.params.id)},{$expr:{$and:[{$eq:[{$month:"$fin"},monthNow]},{$eq:[{$year:"$fin"},yearNow]}]}}]});
                        let relanceClient = await Operation.find({entreprise:new ObjectId(req.params.id),fin:{ $eq: new Date() }});
                        let nombreVisite = await Operation.aggregate([{$match:{entreprise:new ObjectId(req.params.id),fin:{ $eq: new Date() }}},{$group: {_id:null, nombreVisite:{$sum:"$nombreVisite"}}}]);

                        if(nombreVisite.length>0){

                            nbVisite = nombreVisite[0].nombreVisite
                        }else{
                            nbVisite = 0;
                        }

                        res.json({
                            success: true,
                            clients:clients.length,
                            newclient:newClient.length,
                            relance:relanceClient.length,
                            visite:nbVisite,
                        });
                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })
            },

            getAllInfosPromotion(req, res){
                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){
                    if(aclres){

                        //dateEnvoie:{ $eq: new Date() }
                        let promotions = await Promotion.find({entreprise:new ObjectId(req.params.id)});
                        let promotionsms = await Promotion.find({entreprise:new ObjectId(req.params.id),types:"Sms",etat:"envoyée"});
                        let promotionapp = await Promotion.find({entreprise:new ObjectId(req.params.id),types:"App",etat:"envoyée"});
                       
                        res.json({
                            success: true,
                            promotions:promotions.length,
                            sms:promotionsms.length,
                            app:promotionapp.length,
                        });
                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })
            },

            getAllInfos(req, res){
                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){
                    if(aclres){


                        let clients = await Client.find({entreprise:new ObjectId(req.params.id),genre:"Femme"});
                        let clientsH = await Client.find({entreprise:new ObjectId(req.params.id),genre:"Homme"});
                        let clientsI = await Operation.find({entreprise:new ObjectId(req.params.id),nombreVisite:{$eq:0}});

                       
                        res.json({
                            success: true,
                            femme:clients.length,
                            homme:clientsH.length,
                            inactive:clientsI.length,
                        });
                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })
            },

            //statistique promotion

            getPromotionStatApp(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){
                    if(aclres){

                        
                        let promotions = await Promotion.countDocuments({entreprise:new ObjectId(req.params.id),types:'App'});
                        let tauxmessage = await Message.countDocuments({entreprise:new ObjectId(req.params.id),type:"promotion",lire:true});
                        let messages = await Message.countDocuments({entreprise:new ObjectId(req.params.id),type:"promotion"});

                        let taux = parseInt(tauxmessage * 100)/parseInt(messages);
                        //console.log("Promotion", promotions);
                        //console.log("Taux", tauxmessage);
                        //console.log("Message", messages);
                        //console.log("Taux", taux);

                       
                        res.json({
                            success: true,
                            promotions:promotions,
                            taux:taux.toFixed(2),
                            message:messages,
                        });
                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })

            },

            getPromotionStatSms(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){
                    if(aclres){

                        
                        let promotions = await Promotion.countDocuments({entreprise:new ObjectId(req.params.id),types:'Sms'});
                        /*let tauxmessage = await Message.countDocuments({entreprise:new ObjectId(req.params.id),type:"promotion",lire:true});
                        let messages = await Message.countDocuments({entreprise:new ObjectId(req.params.id),type:"promotion"});
                        let taux = parseInt(tauxmessage * 100)/parseInt(messages);*/
                        let taux=0;
                        let messages=0
                        //console.log("Promotion", promotions);
                        //console.log("Message", messages);
                        //console.log("Taux", taux);

                       
                        res.json({
                            success: true,
                            promotions:promotions,
                            taux:taux,
                            message:messages,
                        });
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