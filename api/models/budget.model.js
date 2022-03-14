(function(){

    "use strict";
    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;

    var budgetSchema = new Schema({

        point:{
            type:Number,
            required:false
        },

        achat:{
            type:Number,
            required:false
        },

        entreprise:{
            type: Schema.ObjectId,
            ref: "Entreprises",
            required: true
        },

    });
    module.exports={
        BudgetSchema : budgetSchema,
        BudgetModel : mongoose.model('Budget',budgetSchema)
    }

})();