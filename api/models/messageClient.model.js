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
        },
        automatique:{
            type:Boolean,
            default:false,
            required:false
        },
        dateCreated:{
            type:Date,
            required:false
        },
        etat:{
            type:String,
            required:false
        },
        isCode:{
            type:Boolean,
            default:false,
            required:false
        },
        code:{
            type:String,
            required:false
        }

    });
    module.exports={
        MessageClientSchema : messageClientSchema,
        MessageClientModel : mongoose.model('MessageClient',messageClientSchema)
    }

})();