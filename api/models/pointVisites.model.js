(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var pointVisitesSchema = new Schema({

        point:{
            type:Number,
            required:false
        },

        typesPoint:{
            type: Schema.ObjectId,
            ref: "TypesPoint",
            required: true
        },

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },

    });
    module.exports={
        PointVisitesSchema : pointVisitesSchema,
        PointVisitesModel : mongoose.model('PointVisites',pointVisitesSchema)
    }

})();