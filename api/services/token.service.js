var TokenModel = require('../models/token.model').TokenModel;
var ObjectId = require('mongoose').Types.ObjectId;

module.exports ={

    createToken:(user, userToken)=>{

        return  new Promise (async(resolve, reject)=>{

            try {

                let token = new TokenModel();

                token.user = new ObjectId(user);
                token.token = userToken;
                token.creation = new Date();

                token.save(function(err, token){
                    if(err){
                        console.log("Erreur", err);
                    }else{
                        resolve({
                            message: token,
                            status: 'success'
                        });
                    }
                })
                
            } catch (error) {
                reject(error);
            }


        })

    },

    updateToken:(idUser,userToken)=>{

        return  new Promise (async(resolve, reject)=>{

            try {

                let token = await TokenModel.findOne({user:new ObjectId(idUser)});

                token.token = userToken;
                token.creation = new Date();

                TokenModel.findOneAndUpdate({user:new ObjectId(idUser)},token,{new:true}, function(err,data){
                    if(err){
                        console.log("Erreur", err);
                    }else{
                      resolve({
                         body: data,
                         status: 'success'
                      });
                    }
                });
                
            } catch (error) {
                reject(error);
            }


        })

    }
}