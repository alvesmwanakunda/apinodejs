(function(){
    "use strict";

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var entreprisesSchema = new Schema({

        nom:{
            type:String,
            required:false
        },
        phone1:{
            type:String,
            required:false
        },
        phone2:{
            type:String,
            required:false
        },
        adresse:{
            type:String,
            required:false
        },
        description:{
            type:String,
            required:false
        },
        image:{
           type: String,
           required:false
        },
       categorie: {
           type: String,
           required:false
        },
        createur:[{
            type: Schema.ObjectId,
            ref: "Users",
            required: true
        }]
    });
    module.exports={
        EntrepriseSchema : entreprisesSchema,
        EntrepriseModel : mongoose.model('Entreprises',entreprisesSchema)
    }
})();