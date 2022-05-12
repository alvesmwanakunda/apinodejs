(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var encaisseSchema = new Schema({

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
        EncaisseSchema : encaisseSchema,
        EncaisseModel : mongoose.model('Encaisse',encaisseSchema)
    }
})();