(function(){

    'use strict';
    module.exports = function(app,acl){
        var Ctrl = require('../controller/connexion.controller')(acl);

        app.route('/update/connexion')
         .get(Ctrl.updateConnexion);

        app.route('/connexion/:id([a-fA-F\\d]{24})')
         .get(Ctrl.listConnexion); 



    }
})();