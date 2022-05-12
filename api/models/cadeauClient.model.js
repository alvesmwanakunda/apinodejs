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