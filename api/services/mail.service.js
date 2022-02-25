var nodemailer = require('nodemailer');
module.exports = {


    inscription: async (user)=>{
        return await new Promise((resolve, reject)=>{

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                host: process.env.SMTP_SERVER,
                port: process.env.SMTP_PORT,
                secure: false,
                auth:{
                    user:process.env.SMTP_USERNAME,
                    pass:process.env.SMTP_PASSWORD
                },
                logger:true,
                debug:true
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
                    
                    reject({
                        message: error,
                        status: 'error'
                     });
                }
                transporter.close();
                resolve({
                   message:user,
                   status:"success"
                });
                
            });
        });
    },
    reset:(user)=>{
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
                from: 'Wefid <' + process.env.SMTP_FROM + '>',
                headers:{
                    'X-Laziness-level':1000
                }
            });
            
            let message = {
                to: user.email,
                subject: 'Réinitialisation de mot de passe Wefid',
                html: 'Bonjour, <b>' + user.email + '</b> <br />Une demande a été faite pour réinitialiser le mot de passe de votre compte associé à cette adresse email sur wefid.fr <br /> Vous devez vous rendre sur le site et changer votre mot de passe en cliquant sur le lien suivant: <br /><br /><a href="' + process.env.lostpassword + user.code + '&email=' + user.email + '">' + process.env.lostpassword + user.code + '&email=' + user.email + '</a> <br /><br /> Il s\'agit d\'une connexion temporaire, elle ne peut être utilisée qu\'une fois. Elle expire après 24 heures et rien ne se passe si elle n\'est pas utilisée <br /> Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email et votre mot de passe ne sera pas réinitialisé. <br /> <img src="" />',
            };
            transporter.sendMail(message, (error, user)=>{
                if(error){
                    reject(error);
                }
                resolve(user);
                transporter.close();
            });
        });
    }
    

}