(function(){

    "use strict";
    module.exports = function(app,acl){

        var Ctrl = require('../controller/historiques.controller')(acl);

        app.route('/historique/client/:id([a-fA-F\\d]{24})/:idClient([a-fA-F\\d]{24})')
        .get(Ctrl.listHistoriqueByUserEntreprise);

    }
})();