(function(){
    "use strict";

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var horaireSchema = new Schema({

        oLundi:{
            type:String,
            required:false
        },
        fLundi:{
            type:String,
            required:false
        },
        oMardi:{
            type:String,
            required:false
        },
        fMardi:{
            type:String,
            required:false
        },
        oMercredi:{
            type:String,
            required:false
        },
        fMercredi:{
           type: String,
           required:false
        },
        oJeudi:{
            type:String,
            required:false
        },
        fJeudi:{
           type: String,
           required:false
        },
        oVendredi:{
            type:String,
            required:false
        },
        fVendredi:{
           type: String,
           required:false
        },
        oSamedi:{
            type:String,
            required:false
        },
        fSamedi:{
           type: String,
           required:false
        },
        oDimanche:{
            type:String,
            required:false
        },
        fDimanche:{
           type: String,
           required:false
        },
        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        }
    });
    module.exports={
        HoraireSchema : horaireSchema,
        HoraireModel : mongoose.model('Horaires',horaireSchema)
    }

})();