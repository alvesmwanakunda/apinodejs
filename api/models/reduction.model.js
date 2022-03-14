(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var reductionSchema = new Schema({

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

        montant:{
            type:String,
            required:false
        }

    });
    module.exports={
        ReductionSchema : reductionSchema,
        ReductionModel : mongoose.model('Reduction',reductionSchema)
    }

})();