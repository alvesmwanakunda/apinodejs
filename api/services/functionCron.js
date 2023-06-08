var ObjectId = require('mongoose').Types.ObjectId;
var MessageClient = require('../models/messageClient.model').MessageClientModel;
var Client = require('../models/clients.model').ClientsModel;
var MessageApp = require('../models/messageApp.model').MessageAppModel;
var Promotion = require('../models/promotions.model').PromotionsModel;
var moment = require('moment');
var Operation = require('../models/operation.model').OperationModel;
const axios = require("axios");
var MessageAppService = require('../services/messageApp.service');
var crypto  = require('crypto');


//Function anniversaire

let AnniversaireClientApp = async function(){

    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth()+1;
    console.log("Mois", month);
    let messageApp = await MessageClient.find({etat:"Envoyer",automatique:true,type:"Anniversaire",typePromotion:"App"});
    let client = await Client.find({"day":day,"month":month});

    if(messageApp.length>0){

        messageApp.forEach(async(element) => {

            client.forEach(async (elementClient) => {

                elementClient.entreprise.forEach(async(entreprise) => {


                    if(element.entreprise.equals(entreprise)){

                        let message = new MessageApp();
                        message.message = new ObjectId(element._id);
                        message.client = new ObjectId(elementClient._id);
                        message.entreprise = new ObjectId(element.entreprise);
                        message.dateCreated = new Date();
                        message.lire = false;

                        message.save();
                    }

                });
      
              
            });
              
          });  
    }
   
};

let RelancerApp= async function(){

    let messageApp = await MessageClient.find({etat:"Envoyer",automatique:true,type:"Relancer",typePromotion:"App"});
    var now = new Date();
    let debut = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    

    messageApp.forEach(async(element) => {

        let operation = await Operation.find({entreprise:new ObjectId(element.entreprise)});
        operation.forEach(async(elementOper) => {

            if(elementOper.fin){

            let fin = elementOper.fin.getFullYear()+"-"+(elementOper.fin.getMonth() + 1)+"-"+elementOper.fin.getDate();
        
            const dateFin = moment(fin, "YYYY-MM-DD");
            const dateToday =  moment(debut, "YYYY-MM-DD");
            let numberDate = moment.duration(dateToday.diff(dateFin)).asDays();

            console.log("Fin",numberDate);

            if(numberDate >= element.visite){

                //console.log("Suis la", elementOper);
                let message = new MessageApp();
                message.message = new ObjectId(element._id);
                message.client = new ObjectId(elementOper.client);
                message.entreprise = new ObjectId(element.entreprise);
                message.dateCreated = new Date();
                message.lire = false;
                message.save();
            }

            }
     
        });
        
    });
    


};

let AnniversaireClientSms = async function(){

    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth()+1;
    let messageApp = await MessageClient.find({etat:"Envoyer",automatique:true,type:"Anniversaire",typePromotion:"Sms"}).populate('message');
    let client = await Client.find({"day":day,"month":month});

    let grant = `grant_type=client_credentials`;
    const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
    {headers:{
        Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded'
    }});

    if(messageApp.length>0){

        messageApp.forEach(async(element) => {

            client.forEach(async (elementClient) => {

                elementClient.entreprise.forEach(async(entreprise) => {


                    if(element.entreprise.equals(entreprise)){

                        if(element.entreprise.equals(entreprise)){

                            MessageAppService.notificationSms(elementClient.user,element.message.message,response.data.access_token);

                        } 
                    }

                });
      
              
            });
              
          });  
    }

};

let RelancerSms= async function(){

    let messageApp = await MessageClient.find({etat:"Envoyer",automatique:true,type:"Relancer",typePromotion:"Sms"}).populate('message');
    var now = new Date();
    let debut = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    let grant = `grant_type=client_credentials`;
    const response = await axios.post("https://api.orange.com/oauth/v3/token/",grant,
    {headers:{
        Authorization:`Basic ${process.env.ORANGE_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded'
    }});
    
    messageApp.forEach(async(element) => {

        let operation = await Operation.find({entreprise:new ObjectId(element.entreprise)});

        operation.forEach(async(elementOper) => {

            if(elementOper.fin){

                let fin = elementOper.fin.getFullYear()+"-"+(elementOper.fin.getMonth() + 1)+"-"+elementOper.fin.getDate();
            
                const dateFin = moment(fin, "YYYY-MM-DD");
                const dateToday =  moment(debut, "YYYY-MM-DD");
                let numberDate = moment.duration(dateToday.diff(dateFin)).asDays();

                //console.log("Fin",numberDate);

                if(numberDate >= element.visite){

                    MessageAppService.notificationSms(elementOper.user,element.message.message,response.data.access_token)
                
                }

            } 
        });
        
    });
    


};

// promotion

let PromotionApp = async function(){

    let promotions = await Promotion.find({types:"App",critere:"Programmer date",cible:"Mes clients",etat:"envoyée"});
    var now = moment();
    promotions.forEach(async(element) => {

        let fin = element.jours.getFullYear()+"-"+(element.jours.getMonth() + 1)+"-"+element.jours.getDate();
        var jours = moment(fin);
        if(now===jours){
          MessageAppService.createPromotionApp(element);
        }
    });
};

let PromotionAppWefid = async function(){

    let promotions = await Promotion.find({types:"App",critere:"Programmer date",cible:"Utilisateur Wefid",etat:"envoyée"});
    var now = moment();
    promotions.forEach(async(element) => {

        let fin = element.jours.getFullYear()+"-"+(element.jours.getMonth() + 1)+"-"+element.jours.getDate();
        var jours = moment(fin);
        if(now===jours){
          MessageAppService.createPromotionAppWifed(element);
        }
    });

};

let PromotionAppSms = async function(){

    let promotions = await Promotion.find({types:"Sms",critere:"Programmer date",cible:"Mes clients",etat:"envoyée"});
    var now = moment();
    promotions.forEach(async(element) => {

        let fin = element.jours.getFullYear()+"-"+(element.jours.getMonth() + 1)+"-"+element.jours.getDate();
        var jours = moment(fin);
        if(now===jours){
          MessageAppService.createPromotionSms(element);
        }
    });
};

let PromotionSmsWefid = async function(){

    let promotions = await Promotion.find({types:"Sms",critere:"Programmer date",cible:"Utilisateur Wefid",etat:"envoyée"});
    var now = moment();
    promotions.forEach(async(element) => {

        let fin = element.jours.getFullYear()+"-"+(element.jours.getMonth() + 1)+"-"+element.jours.getDate();
        var jours = moment(fin);
        if(now===jours){
          MessageAppService.createPromotionSmsWifed(element);
        }
    });

}
module.exports={
    AnniversaireClientApp: AnniversaireClientApp,
    RelancerApp: RelancerApp,
    AnniversaireClientSms: AnniversaireClientSms,
    RelancerSms: RelancerSms,
    PromotionApp: PromotionApp,
    PromotionAppWefid: PromotionAppWefid,
    PromotionAppSms: PromotionAppSms,
    PromotionSmsWefid: PromotionSmsWefid
}