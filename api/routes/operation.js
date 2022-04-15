(function(){
    'use strict';
    module.exports = function(app, acl){

        var Ctrl = require('../controller/operation.controller')(acl);

        app.route('/operations/:id([a-fA-F\\d]{24})')
        .get(Ctrl.listeOperationByEntreprise)

        app.route('/operation/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getOperationByClient)
    }
})();