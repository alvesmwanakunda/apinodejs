(function(){

    "use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var messageAppSchema = new Schema({

        message:{
            type: Schema.ObjectId,
            ref: "MessageClient",
            required: true
        },

        client:{
            type: Schema.ObjectId,
            ref: "Clients",
            required: true
        },

        dateCreated:{
            type:Date,
            required:false
        },

        lire:{
            type:Boolean,
            default:false
        }
    });
    module.exports={
        MessageAppSchema : messageAppSchema,
        MessageAppModel : mongoose.model('MessageApp',messageAppSchema)
    }

})();