(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;
    var CadeauClient = require('./cadeauClient.model').CadeauClientModel;

    var cadeauSchema = new Schema({

        point:{
            type:Number,
            required:false
        },

        nombreLivraison:{
            type:Number,
            required:false
        },

        typeCadeau:{
            type:String,
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
            required: false,
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
        },
        client:[{
            
            type: Schema.ObjectId,
            ref: "Users",
            required: false 
        }],

        montant:{
            type:String,
            required:false
        },

        facture:{
            type:Boolean,
            default:false,
            required:false
        },
        devise:{
            type:String,
            required:false
        },
        isCode:{
           type:Boolean,
           default:false,
           required:false
        },
        isArchive:{
            type: Boolean,
            default: false,
            required:false
        }
    });
    cadeauSchema.pre('remove', async function (next) {
        // Supprimer les enfants associés
        await CadeauClient.deleteMany({ cadeau: this._id });
        next();
    });
    module.exports={
        CadeauSchema : cadeauSchema,
        CadeauModel : mongoose.model('Cadeau',cadeauSchema)
    }

})();