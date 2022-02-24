(function(){

    'use strict';
    module.exports = function(app, acl){

        var Ctrl = require('../controller/horaires.controller')(acl);

        app.route('/horaire/:id([a-fA-F\\d]{24})')
         .post(Ctrl.createHoraire)
         .get(Ctrl.getHoraireByEntreprise);

       
    }
})();