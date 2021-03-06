var nodemailer = require('nodemailer');
//var sgMail = require('@sendgrid/mail');
module.exports = {


    inscription: async (user)=>{
        return await new Promise((resolve, reject)=>{

            try {

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
                    html: 'Bonjour, <b>Cher utilisateur</b> <br/> Nous avons bien pris en compte votre inscription sur, <b>Wefid</b>.<br/> Votre identifiant de connexion est le suivant: <span style="color:#008CBA; text-decoration:underline">' + user.email +'</span> <br/> Veuillez cliquer sur ce lien pour valider votre compte <a href="' + process.env.validecompte + user.code + '&email=' + user.email + '">' + process.env.validecompte + user.code + '&email=' + user.email + '</a>'
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
        return new Promise((resolve, reject)=>{

            try {

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
                    subject: 'R??initialisation de mot de passe Wefid',
                    html: 'Bonjour, <b>' + user.email + '</b> <br />Une demande a ??t?? faite pour r??initialiser le mot de passe de votre compte associ?? ?? cette adresse email sur wefid.fr <br /> Vous devez vous rendre sur le site et changer votre mot de passe en cliquant sur le lien suivant: <br /><br /><a href="' + process.env.lostpassword + user.code + '&email=' + user.email + '">' + process.env.lostpassword + user.code + '&email=' + user.email + '</a> <br /><br /> Il s\'agit d\'une connexion temporaire, elle ne peut ??tre utilis??e qu\'une fois. Elle expire apr??s 24 heures et rien ne se passe si elle n\'est pas utilis??e <br /> Si vous n\'??tes pas ?? l\'origine de cette demande, ignorez cet email et votre mot de passe ne sera pas r??initialis??. <br /> <img src="" />',
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