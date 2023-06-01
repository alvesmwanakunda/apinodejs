(function(){

    "use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var messageAppSchema = new Schema({

        message:{
            type: Schema.ObjectId,
            ref: "MessageClient",
            required: false
        },

        promotion:{
          type:Schema.ObjectId,
          ref:"Promotions",
          required: false
        },

        client:{
            type: Schema.ObjectId,
            ref: "Clients",
            required: true
        },

        entreprise:{
         
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
             
        },

        dateCreated:{
            type:Date,
            required:false
        },

        lire:{
            type:Boolean,
            default:false
        },
        type:{
            type: String,
            required:false
        }
    });
    module.exports={
        MessageAppSchema : messageAppSchema,
        MessageAppModel : mongoose.model('MessageApp',messageAppSchema)
    }

})();