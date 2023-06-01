(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var depenseSchema = new Schema({

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },
        user:{
            type: Schema.ObjectId,
            ref: "Users",
            required: true
        },
        client:{
            type: Schema.ObjectId,
            ref: "Clients",
            required: true
        },
        produit:{
            type: Schema.ObjectId,
            ref: "Produits",
            required: true
        },
        point:{
            type:Number,
            required:false
        },
        type:{
            type:String,
            required:false
        },
        creation:{
            type:Date,
            required:false
        }
    });
    module.exports={
        DepenseSchema : depenseSchema,
        DepenseModel : mongoose.model('Depense',depenseSchema)
    }
})();

