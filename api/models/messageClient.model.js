(function(){

    "use strict";
    
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var messageClientSchema=new Schema({

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },
        typePromotion:{
            type:String,
            required:false
        },
        nom:{
            type:String,
            required:false
        },
        type:{
            type:String,
            required:false
        },
        message:{
            type:String,
            required:false
        },
        photo:{
           type:String,
           required:false
        },
        visite:{
            type:Number,
            required:false
        }
    });
    module.exports={
        MessageClientSchema : messageClientSchema,
        MessageClientModel : mongoose.model('MessageClient',messageClientSchema)
    }

})();