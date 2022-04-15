var ObjectId = require('mongoose').Types.ObjectId;
var OperationModel = require('../models/operation.model').OperationModel;
var PointVisites = require('../models/pointVisites.model').PointVisitesModel;

module.exports ={

    addOperationByEntrepise:(idEntreprise, idClient, idUser)=>{

        return  new Promise (async(resolve, reject)=>{

            let operation = new OperationModel();
            let pointVisite = await PointVisites.findOne({entreprise:idEntreprise});
            //console.log("Point visite", pointVisite);

            try {

                operation.entreprise = new ObjectId(idEntreprise);
                operation.client= new ObjectId(idClient);
                operation.user= new ObjectId(idUser);
                operation.creation = new Date(); 
                operation.debut = new Date(); 
                operation.fin = new Date(); 

                if(pointVisite){
                    operation.visite = pointVisite.point;
                }

                operation.save(function(err,operation){

                    if(err){
                    console.log("Erreur", err);
                 }else{
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
    deleteOperationToEntreprise: (idClient)=>{

        return new Promise(async(resolve, reject)=>{

            let operation = await OperationModel.findOne({client:idClient});

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
    }



}
