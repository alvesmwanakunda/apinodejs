(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var operationSchema = new Schema({

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },
        client:{
            type: Schema.ObjectId,
            ref: "Clients",
            required: true
        },
        user:{
            type: Schema.ObjectId,
            ref: "Users",
            required: true
        },
        visite:{
            type:Number,
            required:false,
            default:0
        },
        achat:{
            type:Number,
            required:false,
            default:0
        },
        avoir:{
            type:Number,
            required:false,
            default:0
        },
        pointcadeaux:{
            type:Number,
            required:false,
            default:0
        },
        point:{
            type:Number,
            required:false,
            default:0
        },
        depense:{
           type:Number,
           required:false,
           default:0
        },
        cadeaux:{
            type:String,
            required:false,
        },
        creation:{
            type:Date,
            required:false,
        },
        debut:{
            type:Date,
            required:false,
        },
        fin:{
            type:Date,
            required:false,
        },
    });
    module.exports = {
       OperationSchema : operationSchema,
       OperationModel : mongoose.model('Operation',operationSchema)
    }
})();