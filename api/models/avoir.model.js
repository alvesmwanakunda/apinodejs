(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var avoirSchema = new Schema({

        avoir:{
            type:Boolean,
            required:false,
            default:false
        },
        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        }
    });
    module.exports={
        AvoirSchema : avoirSchema,
        AvoirModel : mongoose.model('Avoir',avoirSchema)
    }

})();