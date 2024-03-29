(function(){
    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var clientsSchema = new Schema({
        
        genre:{
            type:String,
            required:false
        },
        adresse:{
            type:String,
            required:false
        },
        dateNaissance:{
            type:Date,
            required:false
        },

        age:{
            type:String,
            required:false
        },

        numeroClient:{
            type:String,
            required:true,
            unique:true
        },
        nombreVisite:{
            type:Number,
            required:false
        },
        depense:{
            type:Number,
            required:false
        },
        point:{
            type:Number,
            required:false
        },
        avoir:{
            type:Number,
            required:false
        },
        user:{
            type: Schema.ObjectId,
            ref: "Users",
            required: true
        },
        entreprise:[{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: false
        }],
        dateCreated:{
            type:Date,
            required:false
        },
        day:{
            type:Number,
            required:false
        },
        month:{
            type:Number,
            required:false
        }
    });
    module.exports = {
        clientsSchema: clientsSchema,
        ClientsModel : mongoose.model("Clients", clientsSchema)
    }
})();