
var twilio = require("twilio");
const axios = require("axios");

module.exports = {


    inscription:(user)=>{
        return new Promise(async(resolve, reject)=>{

               try {

                 let indicatif = "221";
                 await axios.post(process.env.FREE_API,
                  {
                    from:process.env.SMS_SENDER,
                    to:indicatif + user.phone,
                    text:'Voici votre code de validation wefid : ' + user.code
                  },
                  {
                    headers:{
                      Authorization:`Basic ${process.env.FREE_TOKEN}`
                    }
                  }).then(resp=>{
                    resolve(resp);
                  }).catch((err)=>{
                    console.log(err);
                 })
                
               } catch (error) {
                 reject(error);
               }     
        });
    },
    reset:(user, code)=>{
        return new Promise(async(resolve, reject)=>{


          try {

            let indicatif = "221";
            await axios.post(process.env.FREE_API,
             {
               from:process.env.SMS_SENDER,
               to:indicatif + user.phone,
               text:'Bienvenue sur WEFID, Une demande a été faite pour réinitialiser le mot de passe de votre compte associé à ce numéro sur wefid \n\n Code de validation : ' + code,
             },
             {
               headers:{
                 Authorization:`Basic ${process.env.FREE_TOKEN}`
               }
             }).then(resp=>{
               resolve(resp);
             }).catch((err)=>{
               console.log(err);
            })
           
          } catch (error) {
            reject(error);
          } 
               
        });
    }
    

}