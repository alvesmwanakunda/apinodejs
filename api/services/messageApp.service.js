var MessageApp = require('../models/messageApp.model').MessageAppModel;
var MessageClient = require('../models/messageClient.model').MessageClientModel;
var Promotion = require('../models/promotions.model').PromotionsModel;
var User = require('../models/users.model').UserModel;
var Client = require('../models/clients.model').ClientsModel;
var ObjectId = require('mongoose').Types.ObjectId;
var FCM = require('fcm-node');
var serverKey = "AAAARFctqpI:APA91bEEug6LUaMQgLKMfCbl2d9SfYi0FeB6v1ZZx5j5TR9hfVPYKb7QWom6y9K1yjyeIDynVqNC42GUaFAutdVwMxrV7hMDd3Ncbfktg_gSvCr4JWqnqhQ9obAKH6K75N_N3o_L411d" || process.env.SERVER_KEY;
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
                    message.type = "message";

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
    },

    // message promotion

    createPromotionApp:(promo)=>{

        return  new Promise (async(resolve, reject)=>{

            let d = new Date();
            let currentYear = d.getFullYear();
            var age;

            try {

                let promotion = await Promotion.findOne({_id:promo._id});
                let message = new MessageApp();
                let clients = await Client.find({entreprise:new ObjectId(promo.entreprise)}).populate('user');
            
                clients.forEach(async(element) => {

                   if(element.dateNaissance){
                       age = currentYear - element.dateNaissance.getFullYear();
                   }else{
                       age = 0;
                   } 
                   console.log("age", age);

                   if(promotion.sexe=="Touts" && (age>=promotion.age1 && age<=promotion.age2) ){

                        message.promotion = new ObjectId(promotion._id);
                        message.client = new ObjectId(element._id);
                        message.entreprise = new ObjectId(promotion.entreprise);
                        message.dateCreated = new Date();
                        message.lire = false;
                        message.type = "promotion";

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

                   }if(promotion.sexe=="Femme" && (age>=promotion.age1 && age<=promotion.age2)){


                        message.promotion = new ObjectId(promotion._id);
                        message.client = new ObjectId(element._id);
                        message.entreprise = new ObjectId(promotion.entreprise);
                        message.dateCreated = new Date();
                        message.lire = false;
                        message.type = "promotion";

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

                   }if(promotion.sexe=="Homme" && (age>=promotion.age1 && age<=promotion.age2)){

                        message.promotion = new ObjectId(promotion._id);
                        message.client = new ObjectId(element._id);
                        message.entreprise = new ObjectId(promotion.entreprise);
                        message.dateCreated = new Date();
                        message.lire = false;
                        message.type = "promotion";

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

                   }
 
                });

            } catch (error) {
                reject(error);
            }

           
            

        });
    },

    createPromotionAppWifed:(promo)=>{

        return  new Promise (async(resolve, reject)=>{

            let d = new Date();
            let currentYear = d.getFullYear();
            var age;

            try {

                let promotion = await Promotion.findOne({_id:promo._id});
                let message = new MessageApp();
                let clients = await Client.find().populate('user');
            
                clients.forEach(async(element) => {

                   if(element.dateNaissance){
                       age = currentYear - element.dateNaissance.getFullYear();
                   }else{
                       age = 0;
                   } 
                   console.log("age", age);

                   if(promotion.sexe=="Touts" && (age>=promotion.age1 && age<=promotion.age2) ){

                        message.promotion = new ObjectId(promotion._id);
                        message.client = new ObjectId(element._id);
                        message.entreprise = new ObjectId(promotion.entreprise);
                        message.dateCreated = new Date();
                        message.lire = false;
                        message.type = "promotion";

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

                   }if(promotion.sexe=="Femme" && (age>=promotion.age1 && age<=promotion.age2)){


                        message.promotion = new ObjectId(promotion._id);
                        message.client = new ObjectId(element._id);
                        message.entreprise = new ObjectId(promotion.entreprise);
                        message.dateCreated = new Date();
                        message.lire = false;
                        message.type = "promotion";

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

                   }if(promotion.sexe=="Homme" && (age>=promotion.age1 && age<=promotion.age2)){

                        message.promotion = new ObjectId(promotion._id);
                        message.client = new ObjectId(element._id);
                        message.entreprise = new ObjectId(promotion.entreprise);
                        message.dateCreated = new Date();
                        message.lire = false;
                        message.type = "promotion";

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

                   }
 
                });

            } catch (error) {
                reject(error);
            }

        });
    },

    createPromotionSms:(promo)=>{

        return  new Promise (async(resolve, reject)=>{

            let d = new Date();
            let currentYear = d.getFullYear();
            var age;

            let grant = `grant_type=client_credentials`;
            const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,{
                headers:{Authorization:`Basic ${process.env.ORANGE_TOKEN}`,'Content-Type': 'application/x-www-form-urlencoded'} 
            });

            //if(response.data.access_token){
            try {

                let promotion = await Promotion.findOne({_id:promo._id});
                let clients = await Client.find({entreprise:new ObjectId(promo.entreprise)}).populate('user');
            
                clients.forEach(async(element) => {

                   if(element.dateNaissance){
                       age = currentYear - element.dateNaissance.getFullYear();
                   }else{
                       age = 0;
                   } 
                   console.log("age", age);

                   if(promotion.sexe=="Touts" && (age>=promotion.age1 && age<=promotion.age2) ){

                        const resp = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
                        {
                            "outboundSMSMessageRequest":{
                            "address":`tel:+221${element.user.phone}`,
                            "senderAddress":"tel:+221771852694",
                            "senderName": "Promotion Wefid",
                            "outboundSMSTextMessage":{
                                "message":`${promotion.sms}`
                            }
                            }
                        },
                        {
                            headers:{ Authorization:`Bearer ${response.data.access_token}`}      
                        });
                        resolve({
                            message: resp,
                            status: 'success'
                        });

                   }if(promotion.sexe=="Femme" && (age>=promotion.age1 && age<=promotion.age2)){

                        const resp = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
                        {
                            "outboundSMSMessageRequest":{
                            "address":`tel:+221${element.user.phone}`,
                            "senderAddress":"tel:+221771852694",
                            "senderName": "Promotion Wefid",
                            "outboundSMSTextMessage":{
                                "message":`${promotion.sms}`
                            }
                            }
                        },
                        {
                            headers:{ Authorization:`Bearer ${response.data.access_token}`}      
                        });
                        resolve({
                            message: resp,
                            status: 'success'
                        });


                   }if(promotion.sexe=="Homme" && (age>=promotion.age1 && age<=promotion.age2)){


                        const resp = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
                        {
                            "outboundSMSMessageRequest":{
                            "address":`tel:+221${element.user.phone}`,
                            "senderAddress":"tel:+221771852694",
                            "senderName": "Promotion Wefid",
                            "outboundSMSTextMessage":{
                                "message":`${promotion.sms}`
                            }
                            }
                        },
                        {
                            headers:{ Authorization:`Bearer ${response.data.access_token}`}      
                        });
                        resolve({
                            message: resp,
                            status: 'success'
                        });


                   }
 
                });

            } catch (error) {
                reject(error);
            }    

        });
    },

    createPromotionSmsWifed:(promo)=>{

        return  new Promise (async(resolve, reject)=>{

            let d = new Date();
            let currentYear = d.getFullYear();
            var age;
            let grant = `grant_type=client_credentials`;
            const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,{
                headers:{Authorization:`Basic ${process.env.ORANGE_TOKEN}`,'Content-Type': 'application/x-www-form-urlencoded'} 
            });

            try {

                let promotion = await Promotion.findOne({_id:promo._id});
                let clients = await Client.find().populate('user');
            
                clients.forEach(async(element) => {

                   if(element.dateNaissance){
                       age = currentYear - element.dateNaissance.getFullYear();
                   }else{
                       age = 0;
                   } 
                   console.log("age", age);

                   if(promotion.sexe=="Touts" && (age>=promotion.age1 && age<=promotion.age2) ){


                        const resp = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
                        {
                            "outboundSMSMessageRequest":{
                            "address":`tel:+221${element.user.phone}`,
                            "senderAddress":"tel:+221771852694",
                            "senderName": "Promotion Wefid",
                            "outboundSMSTextMessage":{
                                "message":`${promotion.sms}`
                            }
                            }
                        },
                        {
                            headers:{ Authorization:`Bearer ${response.data.access_token}`}      
                        });
                        resolve({
                            message: resp,
                            status: 'success'
                        });

                   }if(promotion.sexe=="Femme" && (age>=promotion.age1 && age<=promotion.age2)){

                        const resp = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
                        {
                            "outboundSMSMessageRequest":{
                            "address":`tel:+221${element.user.phone}`,
                            "senderAddress":"tel:+221771852694",
                            "senderName": "Promotion Wefid",
                            "outboundSMSTextMessage":{
                                "message":`${promotion.sms}`
                            }
                            }
                        },
                        {
                            headers:{ Authorization:`Bearer ${response.data.access_token}`}      
                        });
                        resolve({
                            message: resp,
                            status: 'success'
                        });

                   }if(promotion.sexe=="Homme" && (age>=promotion.age1 && age<=promotion.age2)){

                        const resp = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
                        {
                            "outboundSMSMessageRequest":{
                            "address":`tel:+221${element.user.phone}`,
                            "senderAddress":"tel:+221771852694",
                            "senderName": "Promotion Wefid",
                            "outboundSMSTextMessage":{
                                "message":`${promotion.sms}`
                            }
                            }
                        },
                        {
                            headers:{ Authorization:`Bearer ${response.data.access_token}`}      
                        });
                        resolve({
                            message: resp,
                            status: 'success'
                        });
                   }
 
                });

            } catch (error) {
                reject(error);
            }

        });
    },

    
}