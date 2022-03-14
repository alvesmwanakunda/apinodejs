(function(){
    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

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
    module.exports={
        ProduitSchema : produitsSchema,
        ProduitModel : mongoose.model('Produits',produitsSchema)
    }

})();