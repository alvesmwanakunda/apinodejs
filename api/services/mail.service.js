var nodemailer = require('nodemailer');
//var sgMail = require('@sendgrid/mail');
var Entrepise = require('../models/entreprises.model').EntrepriseModel;
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {


    inscription: async (user)=>{
        return await new Promise((resolve, reject)=>{

            try {

                let transporter = nodemailer.createTransport({
                    host: process.env.SMTP_SERVER,
                    port: process.env.SMTP_PORT,
                    secure:false,
                    tls:true,
                    auth:{
                        user:process.env.SMTP_USERNAME,
                        pass:process.env.SMTP_PASSWORD
                    },
                    logger: true,
                    debug: true
                },{
                    from: 'Wefid <' + process.env.SMTP_FROM + '>',
                    headers:{
                        'X-Laziness-level':1000
                    }
                });
                
                let message = {
                    to: user.email,
                    subject: 'Inscription au compte Wefid',
                    html: '<b>Bienvenu sur Wefid</b></br> Bonjour '+user.email+',<br/> Merci d\'avoir rejoint Wefid. Nous vous confirmons que votre compte a été créé succès. Afin de vérifier votre adresse mail veuillez cliquer sur le lien, <a href="' + process.env.validecompte + user.code + '&email=' + user.email + '">' + process.env.validecompte + user.code + '&email=' + user.email + '</a> </br> Si vous rencontrez des difficultés pour vous connecter à votre compte, contactez-nous à wefid@gmail.com. </br> <p style="text-align:center">L’équipe WeFid</p>'
                };
                transporter.sendMail(message, (error, user)=>{
                    if(error){
                        console.log("erreur", error);
                        /*return res.status(500).json({
                            success: false,
                            message: error.message
                          });*/
                    }
                    resolve({
                        message:user,
                        status:"success"
                     });
                    transporter.close(); 
                });
                
            } catch (error) {
                console.log("Erreur mail", error);
                reject(error);
            }

           
        });
    },
    reset:(user)=>{
        return new Promise(async(resolve, reject)=>{


            let entreprise = await Entrepise.findOne({createur:new ObjectId(user._id)})


            try {

                let transporter = nodemailer.createTransport({
                    host: process.env.SMTP_SERVER,
                    port: process.env.SMTP_PORT,
                    secure:false,
                    tls:true,
                    auth:{
                        user:process.env.SMTP_USERNAME,
                        pass:process.env.SMTP_PASSWORD
                    },
                    logger: true,
                    debug: true
                },{
                    from: 'Wefid <' + process.env.SMTP_FROM + '>',
                    headers:{
                        'X-Laziness-level':1000
                    }
                });
                
                let message = {
                    to: user.email,
                    subject: 'Réinitialisation de mot de passe Wefid',
                    html: 'Bonjour <b>' + entreprise.nom + ',</b> <br />Nous avons bien reçu une demande de récupération de votre mot de passe WeFid. Pour définir un nouveau mot de passe, veuillez cliquer sur le lien suivant: <a href="' + process.env.lostpassword + user.code + '&email=' + user.email + '">' + process.env.lostpassword + user.code + '&email=' + user.email + '</a> <br /><br /> Si vous n\'êtes pas à l\'origine de cette demande de récupération de votre mot de passe, veuillez ignorer ce message.</br> <p style="text-align:center">L\'équipe WeFid</p>',
                };
                transporter.sendMail(message, (error, user)=>{
                    if(error){
                        console.log("erreur", error);
                    }
                    resolve(user);
                    transporter.close();
                });
                
            } catch (error) {
                console.log("Erreur mail", error);
                reject(error);
            }

            
        });
    },
    

}