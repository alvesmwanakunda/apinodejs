
const Entreprise = require('../models/entreprises.model').EntrepriseModel;
var ObjectId = require('mongoose').Types.ObjectId;


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
    }
}