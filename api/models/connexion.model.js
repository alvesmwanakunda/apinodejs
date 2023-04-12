(function(){
    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var connexionSchema = new Schema({

        user:{
            type: Schema.ObjectId,
            ref: "Users",
            required: false 
        },

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: false 
        },

        connexion: {
            type: Date,
            required:false
        },

        deconnexion: {
            type: Date,
            required:false
        },
        scanne:{
            type:Number,
            required:false,
            default:0
        },
        recompense:{
            type:Number,
            required:false,
            default:0
        }
    });
    module.exports={
        ConnexionSchema : connexionSchema,
        ConnexionModel : mongoose.model('Connexion',connexionSchema)
    }

})();