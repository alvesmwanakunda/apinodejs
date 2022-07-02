var ObjectId = require('mongoose').Types.ObjectId;
var MessageClient = require('../models/messageClient.model').MessageClientModel;
var Client = require('../models/clients.model').ClientsModel;
var MessageApp = require('../models/messageApp.model').MessageAppModel;
var moment = require('moment');
var Operation = require('../models/operation.model').OperationModel;

//Function anniversaire

let AnniversaireClientApp = async function(){

    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth()+1;
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

            let fin = elementOper.fin.getFullYear()+"-"+(elementOper.fin.getMonth() + 1)+"-"+elementOper.fin.getDate();
        
            const dateFin = moment(fin, "YYYY-MM-DD");
            const dateToday =  moment(debut, "YYYY-MM-DD");
            let numberDate = moment.duration(dateToday.diff(dateFin)).asDays();

            //console.log("Fin",numberDate);

            if(numberDate >= element.visite){

                //console.log("Suis la", elementOper);
                let message = new MessageApp();
                message.message = new ObjectId(element._id);
                message.client = new ObjectId(elementOper.client);
                message.dateCreated = new Date();
                message.lire = false;
                message.save();
            }
            
        });
        
    });
    


};

module.exports={
    AnniversaireClientApp: AnniversaireClientApp,
    RelancerApp: RelancerApp
}