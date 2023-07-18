(function(){

    "use strict";

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var MessageApp = require('../models/messageApp.model').MessageAppModel;

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
            required: false,
            default:0
        },
        interval2:{
            type: Number,
            required: false,
            default:0
        },
        age1:{
            type: Number,
            required: false,
            default:0
        },
        age2:{
            type: Number,
            required: false,
            default:0
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
            required: false,
            default:0
        },
        etat:{
            type: String,
            required:false
        },
        dateEnvoie:{
            type: Date,
            required:false
        },
        isCode:{
            type:Boolean,
            default:false,
            required:false
        },
        code:{
            type:String,
            required:false
        }
    });
    promotionsSchema.pre('remove', async function (next) {
        // Supprimer les enfants associés
        await MessageApp.deleteMany({ promotion: this._id });
        next();
    });
    module.exports={
        PromotionsSchema: promotionsSchema,
        PromotionsModel: mongoose.model('Promotions', promotionsSchema)
    }
})();