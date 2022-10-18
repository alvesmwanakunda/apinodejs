var MessageApp = require('../models/messageApp.model').MessageAppModel;
var MessageClient = require('../models/messageClient.model').MessageClientModel;
var User = require('../models/users.model').UserModel;
var ObjectId = require('mongoose').Types.ObjectId;
var FCM = require('fcm-node');
var serverKey = process.env.SERVER_KEY;
var fcm = new FCM(serverKey);
const axios = require("axios");




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
                resolve({
                    message: "Sms send",
                    status: 'success'
                });
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
    },

    notificationPush:(token, title, body)=>{

        return  new Promise (async(resolve, reject)=>{

            var message = {
                to:token,
                collapse_key: 'wefid_app',

                notification:{
                    title: title,
                    body: body,
                    sound:  "default",
                    tag:'wefid_app',
                }
            };

            fcm.send(message, function(err, response){
                if(err){
                    console.log("Something has gone wrong!", err);
                    reject(err);
                }else{
                    console.log("Successfully sent with response: ", response);
                    resolve({
                        message: response,
                        status: 'success'
                    });
                }
            })
        })
    },

    notificationSms:(userId,message, token)=>{
        return new Promise(async(resolve, reject)=>{

            try {

              let user = await User.findOne({_id:new ObjectId(userId)});
    
              const response = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
              {
                "outboundSMSMessageRequest":{
                  "address":`tel:+221${user.phone}`,
                  "senderAddress":"tel:+221771852694",
                  "senderName": "Wefid",
                  "outboundSMSTextMessage":{
                      "message":`${message}`
                  }
                }
              },
              {
                  headers:{ Authorization:`Bearer ${token}`}      
              });
    
              console.log("Response", response);
              resolve(response);
            } catch (error) {
              reject(error);
            }
    
          })
    }
}