(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var zoneSchema = new Schema({

        Area:{
            type:String,
            required:false
        },
        City:{
            type:String,
            required:false
        },
        state:{
            type:String,
            required:false
        },
        region:{
            type:String,
            required:false
        },
        country:{
            type:String,
            required:false
        },
    });
    module.exports={
        ZonesSchema : zoneSchema,
        ZonesModel : mongoose.model('Zones',zoneSchema)
    }

})();