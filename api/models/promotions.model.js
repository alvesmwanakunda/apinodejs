(function(){

    "use strict";

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var promotionsSchema = new Schema({

        nom:{
            type:String,
            required:false
        },
        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },
        types:{
            type:String,
            required:false
        },
        sms:{
            type:String,
            required:false
        },
        email:{
            type: String,
            required: false
        },
        photo:{
            type: String,
            required:false
        },
        cible:{
            type: String,
            required: false
        },
        critere:{
            type: String,
            required: false
        },
        jours:{
            type: Date,
            required: false
        },
        heure:{
            type: String,
            required: false
        },
        condition:{
            type: String,
            required: false
        },
        interval1:{
            type: Number,
            required: false
        },
        interval2:{
            type: Number,
            required: false
        },
        age1:{
            type: Number,
            required: false
        },
        age2:{
            type: Number,
            required: false
        },
        sexe:{
            type: String,
            required: false
        },
        region:[{
            type: String,
            required:false
        }],
        zone:[{
            type: String,
            required:false
        }],
        nombre:{
            type: Number,
            required: false
        },
        etat:{
            type: String,
            required:false
        },
        dateEnvoie:{
            type: Date,
            required:false
        }

    });
    module.exports={
        PromotionsSchema: promotionsSchema,
        PromotionsModel: mongoose.model('Promotions', promotionsSchema)
    }
})();