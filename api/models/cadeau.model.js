(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var cadeauSchema = new Schema({

        point:{
            type:Number,
            required:false
        },

        typesPoint:{
            type: Schema.ObjectId,
            ref: "TypesPoint",
            required: true
        },

        produit:{
            type: Schema.ObjectId,
            ref: "Produits",
            required: true
        },

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },

        dateCreation:{
            type:Date,
            required:false
        },

        dateDebut:{
            type:Date,
            required:false
        },

        dateFin:{
            type:Date,
            required:false
        }


    });
    module.exports={
        CadeauSchema : cadeauSchema,
        CadeauModel : mongoose.model('Cadeau',cadeauSchema)
    }

})();