(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var cadeauClientSchema = new Schema({

        client:{
            type: Schema.ObjectId,
            ref: "Clients",
            required: true
        },
        cadeau:{
            type: Schema.ObjectId,
            ref: "Cadeau",
            required: true
        },
        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },

        nombre:{
            type:Number,
            required:false,
            default:0
        },
        creation:{
            type:Date,
            required:true
        }
    });
    module.exports={
        CadeauClientSchema : cadeauClientSchema,
        CadeauClientModel : mongoose.model('CadeauClient',cadeauClientSchema)
    }

})();