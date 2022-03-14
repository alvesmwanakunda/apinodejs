(function(){
    'use strict';
    module.exports = function(app, acl){
        var Ctrl = require('../controller/cadeau.controller')(acl);
        
        app.route('/cadeau/:id([a-fA-F\\d]{24})')
            .post(Ctrl.createCadeau)
            .get(Ctrl.listCadeauByEntreprise)
            .delete(Ctrl.removeCadeau)
            .put(Ctrl.updateCadeau); 

        app.route('/cadeau/detail/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getCadeau);     
    }
})();