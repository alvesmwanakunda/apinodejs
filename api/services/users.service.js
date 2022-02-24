var User = require('../models/users.model').UserModel;

module.exports = {

    delete:(idUser)=>{
        return new Promise((resolve,reject)=>{

            User.findOne({
                _id:idUser
            }, function(err, user){
                if(err){
                  reject(err);
                }else{
                  user.remove();
                  resolve();
                }
            })

        });
    }
}