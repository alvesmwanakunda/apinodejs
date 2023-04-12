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
    },

    scannerConnexion:(user)=>{

        return new Promise(async(resolve,reject)=>{

            try {

                let connexion = await Connexion.findOne({user:new ObjectId(user)}).sort({connexion:-1});
                connexion.scanne = parseInt(connexion.scanne) + parseInt(1);
                Connexion.findOneAndUpdate({_id:connexion._id},connexion,{new:true},function(error, connexion){

                    if(error){
                        reject({
                            connexion: error,
                            status: 'error'
                         });
                    }else{
                        resolve({
                            connexion: connexion,
                            status: 'success'
                         });
                    }

                })
            } catch (error) {
                reject(error);
            }
        })
    },

    recompenseConnexion:(user)=>{

        return new Promise(async(resolve,reject)=>{

            try {

                let connexion = await Connexion.findOne({user:new ObjectId(user)}).sort({connexion:-1});
                connexion.recompense = parseInt(connexion.recompense) + parseInt(1);
                Connexion.findOneAndUpdate({_id:connexion._id},connexion,{new:true},function(error, connexion){

                    if(error){
                        reject({
                            connexion: error,
                            status: 'error'
                         });
                    }else{
                        resolve({
                            connexion: connexion,
                            status: 'success'
                         });
                    }

                })
            } catch (error) {
                reject(error);
            }
        })
    },

    

}