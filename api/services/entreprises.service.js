
const Entreprise = require('../models/entreprises.model').EntrepriseModel;
var ObjectId = require('mongoose').Types.ObjectId;
const Avoir = require('../models/avoir.model').AvoirModel;
const TypePoint = require('../models/typesPoint.model').TypesPointModel;


module.exports = {

    getEntrepriseByUser:(idUser)=>{

     return new Promise((resolve, reject)=>{

        Entreprise.findOne({createur:new ObjectId(idUser)}, function(err, entreprise){
            if(err){
                reject({
                   body: err,
                   status: 'error'
                });
            }else{
              resolve({
                 body: entreprise,
                 status: 'success'
              });
            }
        });
     })

    },

    addUserToEntreprise:(idEntreprise,idUser)=>{

        //console.log("Ent",idEntreprise);
        //console.log("User", idUser);

        return new Promise((resolve, reject)=>{
        
            Entreprise.findOneAndUpdate({_id:idEntreprise},{$push:{createur:idUser}},function(err,data){

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

    deleteUserToEntreprise:(idEntreprise,idUser)=>{

        //console.log("Ent",idEntreprise);
        //console.log("User", idUser);

        return new Promise((resolve, reject)=>{
        
            Entreprise.findOneAndUpdate({_id:idEntreprise},{$pull:{createur:idUser}},{new:true},function(err,data){

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

    addAvoirToEntreprise:(idEntreprise)=>{
        return new Promise((resolve, reject)=>{

            let avoir = new Avoir();
            avoir.entreprise = new ObjectId(idEntreprise);
            avoir.avoir = false;

            avoir.save(function(err,avoir){

                if(err){
                reject({
                   avoir: err,
                   status: 'error'
                });
             }else{
                resolve({
                   avoir: avoir,
                   status: 'success'
                });
             }
            })
        })
    },

    addTypePoint:(idEntreprise)=>{

        return new Promise((resolve,reject)=>{


            let typePoint=[
                {
                    nom:"Visites",
                    dateCreation:new Date(),
                    entreprise: new ObjectId(idEntreprise)
                },
                {
                    nom:"Achats",
                    dateCreation:new Date(),
                    entreprise: new ObjectId(idEntreprise)
                }
            ];

            TypePoint.insertMany(typePoint,(err, type)=>{

                if(err){
                    reject({
                       type: err,
                       status: 'error'
                    });
                 }else{
                    resolve({
                       type: type,
                       status: 'success'
                    });
                 }

            })

        })

    }
}