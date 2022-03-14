(function(){
    'use strict';
    module.exports = function(app, acl){
    
        var Ctrl = require('../controller/livraison.controller')(acl);

        app.route('/livraison/:id([a-fA-F\\d]{24})')
            .post(Ctrl.createLivraison)
            .get(Ctrl.listLivraisonByEntreprise)
            .delete(Ctrl.removeLivraison)
            .put(Ctrl.updateLivraison); 

        app.route('/livraison/detail/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getLivraison);

    }

})();