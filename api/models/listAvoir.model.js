(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var listAvoirSchema = new Schema({

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },
        client:{
            type: Schema.ObjectId,
            ref: "Clients",
            required: true
        },
        montant:{
            type:Number,
            required:false
        },
        creation:{
            type:Date,
            required:false
        },
        type:{
            type:String,
            required:false
        },
        motif:{
            type:String,
            required:false
        },
        idRef:{
            type: Schema.ObjectId,
            required: false
        }
    });

    module.exports={
        ListAvoirSchema : listAvoirSchema,
        ListAvoirModel : mongoose.model('ListAvoir',listAvoirSchema)
    }
})();