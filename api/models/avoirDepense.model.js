(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var avoirDepenseSchema = new Schema({

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
        montant:{
            type:Number,
            required:false
        },
        creation:{
            type:Date,
            required:false
        }
    });

    module.exports={
        AvoirDepenseSchema : avoirDepenseSchema,
        AvoirDepenseModel : mongoose.model('AvoirDepense',avoirDepenseSchema)
    }
})();