(function(){
    "use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var historiquesSchema = new Schema({

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
        creation:{
            type: Date,
            required:false
        }
    });
    module.exports={
        HistoriquesSchema: historiquesSchema,
        HistoriquesModel: mongoose.model('Historiques', historiquesSchema)
    }
})();