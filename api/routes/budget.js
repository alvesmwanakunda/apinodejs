(function(){
    'use strict';
    module.exports = function(app, acl){
    
        var Ctrl = require('../controller/budget.controller')(acl);

        app.route('/budget/:id([a-fA-F\\d]{24})')
            .post(Ctrl.createBudget)
            .get(Ctrl.listBudgetByEntreprise)
            .delete(Ctrl.removeBudget)
            .put(Ctrl.updateBudget); 

        app.route('/budget/detail/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getBudget);

    }

})();