(function(){
    'use strict';
    module.exports = function(app, acl){
        var Ctrl = require('../controller/reduction.controller')(acl);
        
        app.route('/reduction/:id([a-fA-F\\d]{24})')
            .post(Ctrl.createReduction)
            .get(Ctrl.listReductionByEntreprise)
            .delete(Ctrl.removeReduction)
            .put(Ctrl.updateReduction);  

        app.route('/reduction/detail/:id([a-fA-F\\d]{24})')
           .get(Ctrl.getReduction)     
    }
})();