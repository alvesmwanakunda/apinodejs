
var twilio = require("twilio");
const axios = require("axios");

module.exports = {


    inscription:(user,token)=>{

      return new Promise(async(resolve, reject)=>{

        try {

          const response = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
          {
            "outboundSMSMessageRequest":{
              "address":`tel:+221${user.phone}`,
              "senderAddress":"tel:+221771852694",
              "senderName": "Wefid",
              "outboundSMSTextMessage":{
                  "message":'Voici votre code de validation wefid : ' + user.code
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

    reset:(user, code, token)=>{

      return new Promise(async(resolve, reject)=>{

        try {

          const response = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
          {
            "outboundSMSMessageRequest":{
              "address":`tel:+221${user.phone}`,
              "senderAddress":"tel:+221771852694",
              "senderName": "Wefid",
              "outboundSMSTextMessage":{
                  "message":'Bienvenue sur WEFID, Une demande a été faite pour réinitialiser le mot de passe de votre compte associé à ce numéro sur wefid \n\n Code de validation : ' + code
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

    testMessage:(token)=>{

      return new Promise(async(resolve, reject)=>{

        try {

          const response = await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B221771852694/requests",
          {
            "outboundSMSMessageRequest":{
              "address":"tel:+221773017867",
              "senderAddress":"tel:+221771852694",
              "senderName": "Wefid",
              "outboundSMSTextMessage":{
                  "message":"Bonjour Alves comment tu vas?"
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