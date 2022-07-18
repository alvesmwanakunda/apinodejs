var MessageApp = require('../models/messageApp.model').MessageAppModel;
var MessageClient = require('../models/messageClient.model').MessageClientModel;
var ObjectId = require('mongoose').Types.ObjectId;


module.exports ={

    createBrouillonApp:(idMessage,idClient)=>{

        return  new Promise ((resolve, reject)=>{

            try {

                let message = new MessageApp();
                message.message = new ObjectId(idMessage);
                message.client = new ObjectId(idClient);
                message.dateCreated = new Date();
                message.lire = false;

                message.save(function(err, message){
                    if(err){
                        console.log("Erreur", err);
                    }else{
                        resolve({
                            message: message,
                            status: 'success'
                         });
                    }
                })
                
            } catch (error) {
                 reject(error);
            }


        })

    },

    createMessageVisite:(idMessage, idClient)=>{

        return  new Promise (async(resolve, reject)=>{

            let messageClient = await MessageClient.findOne({_id:new ObjectId(idMessage)});
            let message = new MessageApp();

            if(messageClient.typePromotion=="App"){

                try {

                    message.message = new ObjectId(idMessage);
                    message.client = new ObjectId(idClient);
                    message.entreprise = new ObjectId(messageClient.entreprise);
                    message.dateCreated = new Date();
                    message.lire = false;

                    message.save(function(err, message){
                        if(err){
                            console.log("Erreur", err);
                        }else{
                            resolve({
                                message: message,
                                status: 'success'
                            });
                        }
                    })
                    
                } catch (error) {
                    reject(error);
                }
            }else{

            }


        })
    },

    updateManyMessage:(idClient, idEntreprise)=>{

        return  new Promise (async(resolve, reject)=>{

            try {

                MessageApp.updateMany({client:new ObjectId(idClient),entreprise:new ObjectId(idEntreprise)},{"$set":{"lire":true}},function(err,message){

                    if(err){
                        console.log("Erreur", err);
                    }else{
                        resolve({
                            message: message,
                            status: 'success'
                        });
                    }
                })
                
            } catch (error) {
                reject(error);
            }



        })
    }
}