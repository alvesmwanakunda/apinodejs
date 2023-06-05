(function(){
    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;
    var Cadeau = require('./cadeau.model').CadeauModel;
    var Depense = require('./depense.model').DepenseModel;

    var produitsSchema = new Schema({

        nom:{
            type:String,
            required:false
        },
        photo:{
            type:String,
            required:false
        },
        description:{
            type:String,
            required:false
        },
        quantite:{
            type:Number,
            required:false
        },
        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },

    });
    produitsSchema.pre('remove', async function (next) {
        // Supprimer les enfants associés
        await Cadeau.deleteMany({ produit: this._id });
        await Depense.deleteMany({ produit: this._id });
        next();
      });
    module.exports={
        ProduitSchema : produitsSchema,
        ProduitModel : mongoose.model('Produits',produitsSchema)
    }

})();