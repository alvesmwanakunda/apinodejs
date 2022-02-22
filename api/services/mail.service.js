var nodemailer = require('nodemailer');
module.exports = {


    inscription:(user)=>{
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
                html: 'Bonjour, <b>Cher utilisateur</b> <br/> Nous avons bien pris en compte votre inscription sur, <b>Restaurant</b>.<br/> Votre identifiant de connexion est le suivant: <span style="color:#008CBA; text-decoration:underline">' + user.email +'</span> <br/> Veuillez cliquer sur ce lien pour valider votre compte <a href="' + process.env.validecompte + user.code + '&email=' + user.email + '">' + process.env.validecompte + user.code + '&email=' + user.email + '</a>'
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
                from: 'Restaurant <' + process.env.SMTP_FROM + '>',
                headers:{
                    'X-Laziness-level':1000
                }
            });
            
            let message = {
                to: user.email,
                subject: 'Réinitialisation de mot de passe Restaurant',
                html: 'Bonjour, <b>' + user.email + '</b> <br />Une demande a été faite pour réinitialiser le mot de passe de votre compte associé à cette adresse email sur restaurant.fr <br /> Vous devez vous rendre sur le site et changer votre mot de passe en cliquant sur le lien suivant: <br /><br /><a href="' + process.env.lostpassword + user.code + '&email=' + user.email + '">' + process.env.lostpassword + user.code + '&email=' + user.email + '</a> <br /><br /> Il s\'agit d\'une connexion temporaire, elle ne peut être utilisée qu\'une fois. Elle expire après 24 heures et rien ne se passe si elle n\'est pas utilisée <br /> Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email et votre mot de passe ne sera pas réinitialisé. <br /> <img src="" />',
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