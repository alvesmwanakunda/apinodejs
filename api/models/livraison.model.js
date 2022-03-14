(function(){
    
    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var livraisonSchema = new Schema({

        point:{
            type:Number,
            required:false
        },

        typesPoint:{
            type: Schema.ObjectId,
            ref: "TypesPoint",
            required: true
        },

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },

    });
    module.exports={
        LivraisonSchema : livraisonSchema,
        LivraisonModel : mongoose.model('Livraison',livraisonSchema)
    }

})();