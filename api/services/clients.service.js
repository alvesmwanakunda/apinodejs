var nodemailer = require('nodemailer');
var twilio = require("twilio");
var Client = require('../models/clients.model').ClientsModel;
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = {


    inscriptionClient:(user, password)=>{
        return new Promise((resolve, reject)=>{

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
                from: 'Restaurant <' + process.env.SMTP_FROM + '>',
                headers:{
                    'X-Laziness-level':1000
                }
            });
            
            let message = {
                to: user.email,
                subject: 'Inscription au compte Restaurant',
                html: 'Bonjour, <b>Cher utilisateur</b> <br/> Nous avons bien pris en compte votre inscription sur, <b>Restaurant</b>.<br/> Votre identifiant de connexion est le suivant: <span style="color:#008CBA; text-decoration:underline">' + user.email +'</span><br/>Votre mot de passe temporaire est: <span style="color:#008CBA; text-decoration:underline">' + password +'</span> <br/> Veuillez cliquer sur ce lien pour valider votre compte <a href="' + process.env.validecompte + user.code + '&email=' + user.email + '">' + process.env.validecompte + user.code + '&email=' + user.email + '</a>' 
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

    inscriptionSms:(user)=>{

        return new Promise((resolve, reject)=>{

                  let indicatif = "+221";
                  var twilioclient = new twilio(process.env.accountSid, process.env.authToken);

                  twilioclient.messages.create({
                      body: 'Voici votre code de validation restaurant : ' + user.code,
                      to: indicatif + user.phone,
                      from: process.env.twiliofrom
                    })
                    .then((message) => {
                      resolve(message);  
                    }).catch((err) => {
                      console.log(err);
                      reject(err);
                    });
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

                resolve({
                   client: client,
                   status: 'success'
                });
             }

            })

        });
    }


}