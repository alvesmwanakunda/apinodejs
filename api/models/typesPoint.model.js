(function(){
    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var typesPointsSchema = new Schema({

        nom:{
            type:String,
            required:false
        },
        
        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },

        dateCreation:{
            type:Date,
            required:false
        }
    });
    module.exports={
        TypesPointSchema : typesPointsSchema,
        TypesPointModel : mongoose.model('TypesPoint',typesPointsSchema)
    }

})();