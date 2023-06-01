(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var tokenSchema = new Schema({

        user:{
            type: Schema.ObjectId,
            ref: "Users",
            required: true
        },
        token:{
            type:String,
            required:false,
            default:false
        },
        creation:{
            type:Date,
            required:false
        }

    });
    module.exports={
        TokenSchema : tokenSchema,
        TokenModel : mongoose.model('Token',tokenSchema)
    }

})();