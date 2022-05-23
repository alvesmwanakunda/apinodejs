var Connexion = require('../models/connexion.model').ConnexionModel;
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = {

    addConnexion:(user,entreprise)=>{

        return new Promise((resolve,reject)=>{

            let connexion = new Connexion();
            connexion.user = new ObjectId(user);
            connexion.entreprise = new ObjectId(entreprise);
            connexion.connexion = new Date();

            connexion.save(function(err,connexion){
                if(err){
                    reject({
                        clients: err,
                        status: 'error'
                     });
                }else{
                    resolve({
                        connexion: connexion,
                        status: 'success'
                     });
                }
            })
        })
    }

}