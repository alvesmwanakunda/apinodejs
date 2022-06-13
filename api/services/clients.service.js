var nodemailer = require('nodemailer');
var twilio = require("twilio");
var Client = require('../models/clients.model').ClientsModel;
var ObjectId = require('mongoose').Types.ObjectId;
var operationService = require('../services/operation.service');


module.exports = {


    inscriptionClient: async(user, password)=>{
        return await new Promise((resolve, reject)=>{

            let transporter = nodemailer.createTransport({
                host: process.env.SMTP_SERVER,
                port: process.env.SMTP_PORT,
                secure: false,
                auth:{
                    user:process.env.SMTP_USERNAME,
                    pass:process.env.SMTP_PASSWORD
                },
                logger:false,
                debug:false
            },{
                from: 'Wefid <' + process.env.SMTP_FROM + '>',
                headers:{
                    'X-Laziness-level':1000
                }
            });
            
            let message = {
                to: user.email,
                subject: 'Inscription au compte Wefid',
                html: 'Bonjour, <b>Cher utilisateur</b> <br/> Nous avons bien pris en compte votre inscription sur, <b>Wefid</b>.<br/> Votre identifiant de connexion est le suivant: <span style="color:#008CBA; text-decoration:underline">' + user.email +'</span><br/>Votre mot de passe temporaire est: <span style="color:#008CBA; text-decoration:underline">' + password +'</span> <br/> Veuillez cliquer sur ce lien pour valider votre compte <a href="' + process.env.validecompte + user.code + '&email=' + user.email + '">' + process.env.validecompte + user.code + '&email=' + user.email + '</a>' 
            };
            transporter.sendMail(message, (error, user)=>{
                if(error){
                    reject(error);
                }
                resolve(user);
                transporter.close();
            });
        });
    },

    inscriptionSms:(user,password)=>{

        return new Promise((resolve, reject)=>{

            try {

                let indicatif = "+221";
                  var twilioclient = new twilio(process.env.accountSid, process.env.authToken);

                  twilioclient.messages.create({
                      body: 'Bonjour, \n\n Cher utilisateur \n\n Nous avons bien pris en compte votre inscription sur,Wefid. \n\n Votre identifiant de connexion est le suivant: ' + user.phone +'.\n\n Votre mot de passe temporaire est : ' +password,
                      to: indicatif + user.phone,
                      from: process.env.twiliofrom
                    })
                    .then((message) => {
                      resolve(message);  
                    }).catch((err) => {
                      console.log(err);
                    });
                
            } catch (error) {
                reject(error);
            }

                  
        });

    },

    inscriptionSmsPhone:(user)=>{

        return new Promise((resolve, reject)=>{

            try {

                let indicatif = "+221";
                  var twilioclient = new twilio(process.env.accountSid, process.env.authToken);

                  twilioclient.messages.create({
                      body: 'Bonjour,Cher utilisateur \n\n Nous avons bien pris en compte votre inscription sur, Wefid. \n\n Votre identifiant de connexion est le suivant: ' +user.phone,
                      to: indicatif + user.phone,
                      from: process.env.twiliofrom
                    })
                    .then((message) => {
                      resolve(message);  
                    }).catch((err) => {
                      console.log(err);
                    });
                
            } catch (error) {
                reject(error);
            }

                  
        });

    },

    listClientByEntreprise:(idEntreprise)=>{
        return new Promise((resolve, reject)=>{

           Client.find({entreprise:new ObjectId(idEntreprise)}, function(err, clients){

             if(err){

                reject({
                   clients: err,
                   status: 'error'
                });
             }else{

                resolve({
                   clients: clients,
                   status: 'success'
                });
             }

           }).populate('user','nom prenom phone');
        });
    },

    getClientById:(idClient)=>{
        return new Promise((resolve, reject)=>{

            Client.findById({_id:new ObjectId(idClient)}, function(err, client){

                 if(err){

                reject({
                   clients: err,
                   status: 'error'
                });
             }else{

                resolve({
                   client: client,
                   status: 'success'
                });
             }

            }).populate('user','nom prenom phone email');

        });
    },

    saveExcel:(user)=>{

        return new Promise((resolve, reject)=>{

            let client = new Client(user);
            //console.log("User Ici", user);

            client.save(function(err,client){

                if(err){

                reject({
                   clients: err,
                   status: 'error'
                });
             }else{

                operationService.addOperationByEntrepise(client.entreprise, client._id,client.user); 
                resolve({
                   client: client,
                   status: 'success'
                });
             }

            })

        });
    },
    deleteClientToEntreprise:(idClient,idEntreprise)=>{


        return new Promise((resolve, reject)=>{
        
            Client.findOneAndUpdate({_id:idClient},{$pull:{entreprise:idEntreprise}},{new:true},function(err,data){

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
    updateClient:(user,genre,adresse,age)=>{

        return new Promise(async(resolve,reject)=>{

            let client = await Client.findOne({user:new ObjectId(user)});
            try {

                client.genre = genre;
                client.adresse = adresse;
                client.age = age;

                Client.findOneAndUpdate({_id:client._id},client,{new:true},function(err, user){
                    if(err){
                       console.log("Erreur update client", err)
                    }else{
                        resolve({
                            body: user,
                            status: 'success'
                         });
                    } 
                 });
            } catch (error) {
                reject(error);
            }



        });
    }


}