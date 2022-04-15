var twilio = require("twilio");
module.exports = {


    inscription:(user)=>{
        return new Promise((resolve, reject)=>{

               try {

                let indicatif = "+221";
                var twilioclient = new twilio(process.env.accountSid, process.env.authToken);

                twilioclient.messages.create({
                    body: 'Voici votre code de validation wefid : ' + user.code,
                    to: indicatif + user.phone,
                    from: process.env.twiliofrom
                  })
                  .then((message) => {
                    resolve(message);  
                  }).catch((err) => {
                    console.log(err);
                    reject(err);
                  });
                 
               } catch (error) {
                reject(error);
               }

                 
              
        });
    },
    reset:(user, code, password)=>{
        return new Promise((resolve, reject)=>{

                let indicatif = "+221";

                var twilioclient = new twilio(process.env.accountSid, process.env.authToken);
                twilioclient.messages.create({
                    body: 'Bienvenue sur WEFID, voici votre code de validation : ' + code + '\n\nVotre nouveau mot de passe WEFID.  est :' + password,
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
    }
    

}