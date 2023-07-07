var ObjectId = require('mongoose').Types.ObjectId;
var OperationModel = require('../models/operation.model').OperationModel;
var PointVisites = require('../models/pointVisites.model').PointVisitesModel;
var CadeauClient = require('../models/cadeauClient.model').CadeauClientModel;
var Cadeau = require('../models/cadeau.model').CadeauModel;
var Depense = require('../models/depense.model').DepenseModel;
var Encaisse = require('../models/encaisse.model').EncaisseModel;
var AvoirEncaisse = require('../models/avoirEncaisse.model').AvoirEncaisseModel;
var AvoirDepense = require('../models/avoirDepense.model').AvoirDepenseModel;
var Client = require('../models/clients.model').ClientsModel;
var ListAvoir = require('../models/listAvoir.model').ListAvoirModel;
var socketInit = require('../../socket');
var Historiques = require('../models/historiques.model').HistoriquesModel;

module.exports ={

    addOperationByEntrepise:(idEntreprise, idClient, user)=>{

        return  new Promise (async(resolve, reject)=>{

            let operation = new OperationModel();
            let pointVisite = await PointVisites.findOne({entreprise:idEntreprise});

            let encaisse = new Encaisse();
           
            //console.log("Point visite", pointVisite);

            try {

                operation.entreprise = new ObjectId(idEntreprise);
                operation.client= new ObjectId(idClient);
                operation.user= new ObjectId(user);
                operation.creation = new Date(); 
                operation.debut = new Date(); 
                operation.fin = new Date();
                operation.nombreVisite = 1;
                
                encaisse.creation = new Date();
                encaisse.user = new ObjectId(user);
                encaisse.entreprise = new ObjectId(idEntreprise);
                encaisse.type = "Visites";

                if(pointVisite){
                    operation.visite = pointVisite.point;
                    operation.point = pointVisite.point;
                    encaisse.point = pointVisite.point;
                }

                operation.save(function(err,operation){

                    if(err){
                    console.log("Erreur", err);
                 }else{
                    encaisse.save();
                   resolve({
                       operation: operation,
                       status: 'success'
                    });
                 }
                })
            } catch (error) {
                reject(error);
            }

        })
    },

    addOperationByEntrepiseFile:(idEntreprise, idClient, user)=>{

        return  new Promise (async(resolve, reject)=>{

            let operation = new OperationModel();
            try {

                operation.entreprise = new ObjectId(idEntreprise);
                operation.client= new ObjectId(idClient);
                operation.user= new ObjectId(user);
                operation.creation = new Date(); 
                operation.save(function(err,operation){

                    if(err){
                    console.log("Erreur", err);
                 }else{
                    encaisse.save();
                   resolve({
                       operation: operation,
                       status: 'success'
                    });
                 }
                })
            } catch (error) {
                reject(error);
            }

        })
    },


    listOperationByEntreprise:(idEntreprise)=>{
        return new Promise((resolve, reject)=>{

           OperationModel.find({entreprise:new ObjectId(idEntreprise)}, function(err, operations){

             if(err){

                reject({
                   operations: err,
                   status: 'error'
                });
             }else{

                resolve({
                   operations: operations,
                   status: 'success'
                });
             }

           }).populate('client').populate('user');
        });
    },


    deleteOperationToEntreprise: (idClient,idEntreprise)=>{

        return new Promise(async(resolve, reject)=>{

            let operation = await OperationModel.findOne({client:idClient,entreprise:idEntreprise});

            operation.delete(function(err, operation){

                if(err){
                    reject(err);
                }else{
                    resolve({
                    body: operation,
                    status: 'success'
                    });    
                }
            })

        })
    },

    deleteMultiOperationEntreprise:(clients, idEntreprise)=>{

        return new Promise(async(resolve, reject)=>{

            OperationModel.deleteMany({
                entreprise:idEntreprise,
                client:{$in:clients.map(function(obj){
                    return new ObjectId(obj.id)
                  })
                }
            }, function(err, operation){

                if(err){
                    reject(err);
                }else{
                    resolve({
                    body: operation,
                    status: 'success'
                    });    
                }

            })

        })

    },

    addCadeauClient:(client,idCadeau,entreprise)=>{

        return new Promise((resolve,reject)=>{

            let cadeau = new CadeauClient();
            cadeau.creation = new Date();
            cadeau.client = new ObjectId(client);
            cadeau.cadeau = new ObjectId(idCadeau);
            cadeau.entreprise = new ObjectId(entreprise),
            cadeau.nombre = 1;

            cadeau.save(function(err,cadeau){

                if(err){
                reject({
                   avoir: err,
                   status: 'error'
                });
             }else{
                resolve({
                   cadeau: cadeau,
                   status: 'success'
                });
             }
            })
        })
    },

    updateCadeauClient:(id)=>{

        return new Promise(async(resolve,reject)=>{

          let cadeau = await CadeauClient.findOne({_id:id});
          cadeau.nombre = parseInt(cadeau.nombre) + parseInt(1);

          try {

            CadeauClient.findOneAndUpdate({_id:new ObjectId(id)},cadeau,{new:true}, function(err,data){
                if(err){
                    console.log("Erreur", err);
                }else{
                  resolve({
                     body: data,
                     status: 'success'
                  });
                }
            });
              
          } catch (error) {
            reject(error);
          }

        })

    },

    updateCadeau:(id)=>{

        return new Promise(async(resolve,reject)=>{

          let cadeau = await Cadeau.findOne({_id:id});

          if(!cadeau.isCode){

            cadeau.isCode = true;
            try {

                Cadeau.findOneAndUpdate({_id:new ObjectId(id)},cadeau,{new:true}, function(err,data){
                    if(err){
                        console.log("Erreur", err);
                    }else{
                      resolve({
                         body: data,
                         status: 'success'
                      });
                    }
                });
                  
              } catch (error) {
                reject(error);
              }

          }
        })

    },

    addUserCadeau:(idCadeau,user)=>{

        return new Promise(async(resolve,reject)=>{

            try {

                //let cadeau = await Cadeau.findOne({_id:idCadeau});
                Cadeau.findOneAndUpdate({_id:new ObjectId(idCadeau)},{$push:{client:user}},{new:true}, function(err,data){

                    if(err){
                        console.log("Erreur", err);
                    }else{
                      resolve({
                         body: data,
                         status: 'success'
                      });
                    }
                });
                
            } catch (error) {
             reject(error);
            }

        })
    },

    addDepense:(user,entreprise,produit,point,type)=>{
        return new Promise(async(resolve,reject)=>{

            let client = await Client.findOne({user:user});

            let depense = new Depense();
            depense.creation = new Date();
            depense.user = new ObjectId(user);
            depense.type = type;
            if(client){
              depense.client = new ObjectId(client._id);
            }
            depense.entreprise = new ObjectId(entreprise);
            depense.produit = new ObjectId(produit);
            depense.point = point;

            depense.save(function(err,depense){

                if(err){
                    reject({
                       depense: err,
                       status: 'error'
                    });
                 }else{
                    if(global.socket!=undefined){
                        global.socket.broadcast.emit('get_depense', depense.point);
                     }
                   
                    resolve({
                       depense: depense,
                       status: 'success'
                    });
                 }
            })
        })
    },

    addEncaisse:(user,entreprise,point,type)=>{

        return new Promise((resolve,reject)=>{

            let encaisse = new Encaisse();
            encaisse.creation = new Date();
            encaisse.user = new ObjectId(user);
            encaisse.entreprise = new ObjectId(entreprise);
            encaisse.point = point;
            encaisse.type = type;

            encaisse.save(function(err,encaisse){

                if(err){
                    reject({
                       encaisse: err,
                       status: 'error'
                    });
                 }else{
                    resolve({
                       encaisse: encaisse,
                       status: 'success'
                    });
                 }
            })
        })

    },

    addAvoirEncaisse:(user,client,entreprise,montant)=>{

        return new Promise((resolve,reject)=>{

            let encaisse = new AvoirEncaisse();
            let listAvoir = new ListAvoir();
            encaisse.user = new ObjectId(user);
            encaisse.client = new ObjectId(client);
            encaisse.entreprise = new ObjectId(entreprise);
            encaisse.montant = montant;
            encaisse.creation = new Date();

            encaisse.save(function(err,encaisse){

                if(err){
                    reject({
                       encaisse: err,
                       status: 'error'
                    });
                 }else{
                    listAvoir.client = new ObjectId(client);
                    listAvoir.entreprise = new ObjectId(entreprise);
                    listAvoir.montant = montant;
                    listAvoir.creation = new Date();
                    listAvoir.idRef= new ObjectId(encaisse._id);
                    listAvoir.type="Remis"; 
                    listAvoir.save();
                    resolve({
                       encaisse: encaisse,
                       status: 'success'
                    });
                 }
            })

        })

    },

    addAvoirDepense:(user,client,entreprise,montant)=>{

        return new Promise((resolve,reject)=>{

            let depense = new AvoirDepense();
            let listAvoir = new ListAvoir();
            depense.user = new ObjectId(user);
            depense.client = new ObjectId(client._id);
            depense.entreprise = new ObjectId(entreprise);
            depense.montant = montant;
            depense.creation = new Date();
            depense.save(function(err,encaisse){

                if(err){
                    reject({
                       encaisse: err,
                       status: 'error'
                    });
                 }else{
                    listAvoir.client = new ObjectId(client._id);
                    listAvoir.entreprise = new ObjectId(entreprise);
                    listAvoir.montant = montant;
                    listAvoir.creation = new Date();
                    listAvoir.idRef= new ObjectId(depense._id);
                    listAvoir.type="Réclamé"; 
                    listAvoir.save(); 
                    resolve({
                       encaisse: encaisse,
                       status: 'success'
                    });
                 }
            })

        })

    },

    deleteAvoirEncaisse:(idAvoir)=>{
        return new Promise(async(resolve, reject)=>{

            let encaisse = await AvoirEncaisse.findOne({_id:idAvoir});

            encaisse.delete(function(err, operation){

                if(err){
                    reject(err);
                }else{
                    resolve({
                    body: operation,
                    status: 'success'
                    });    
                }
            })

        })
    },

    deletelistAvoirEncaisse:(idAvoir, entreprise)=>{
        return new Promise(async(resolve, reject)=>{

            let encaisse = await ListAvoir.findOne({idRef:idAvoir, entreprise:entreprise});

            encaisse.delete(function(err, operation){

                if(err){
                    reject(err);
                }else{
                    resolve({
                    body: operation,
                    status: 'success'
                    });    
                }
            })

        })
    },

    addClientToEntreprise:(idClient,idEntreprise)=>{

        return new Promise((resolve,reject)=>{


          Client.findOneAndUpdate({_id:idClient},{$push:{entreprise:idEntreprise}},function(err,data){

            if(err){
                reject({
                   body: err,
                   status: 'error'
                });
            }else{
              resolve({
                 body: data,
                 status: 'success'
              });
            }

        });

        })

    },

    addHistorique:(entreprise,client)=>{

        return new Promise((resolve,reject)=>{

            let historique = new Historiques();
            historique.creation = new Date();
            historique.client = new ObjectId(client);
            historique.entreprise = new ObjectId(entreprise),
           

            historique.save(function(err,historique){

                if(err){
                reject({
                   avoir: err,
                   status: 'error'
                });
             }else{
                resolve({
                   historique: historique,
                   status: 'success'
                });
             }
            })
        })
    },



}
