(function(){
    "use strict";

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        prenom:{
            type:String,
            required: false
        },
        nom:{
            type:String,
            required: false
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        phone:{
          type:String,
          required:true
        },
        password:{
          type: String,
          required:true,
          select:false
        },
        valid:{
            type: Boolean,
            default: true
        },
        desactive:{
            type: Boolean,
            default: false
        },
        role:String,
        code: {
            type: String,
            required: false,
            select: false
        }
    });

    module.exports = {
        userSchema: userSchema,
        UserModel: mongoose.model('Users',userSchema)
    }
})();