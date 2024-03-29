(function(){

    "use strict";
    var Client = require('../models/clients.model').ClientsModel;
    var clientService = require('../services/clients.service');
    var ObjectId = require('mongoose').Types.ObjectId;
    var Operation = require('../models/operation.model').OperationModel;
    var Promotion = require('../models/promotions.model').PromotionsModel;


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


                        let promotions = await Promotion.find({entreprise:new ObjectId(req.params.id), dateEnvoie:{ $eq: new Date() }});
                        let promotionsms = await Promotion.find({entreprise:new ObjectId(req.params.id),types:"Sms",etat:"envoyée",dateEnvoie:{ $eq: new Date() }});
                        let promotionapp = await Promotion.find({entreprise:new ObjectId(req.params.id),types:"App",etat:"envoyée",dateEnvoie:{ $eq: new Date() }});
                       
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
        }
    }



})();