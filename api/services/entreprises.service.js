
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

    }
}