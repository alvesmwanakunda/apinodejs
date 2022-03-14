(function(){
    'use strict';
    module.exports = function(app, acl){
    
        var Ctrl = require('../controller/pointVisites.controller')(acl);

        app.route('/pointvisite/:id([a-fA-F\\d]{24})')
            .post(Ctrl.createPointVisite)
            .get(Ctrl.listPointVisiteByEntreprise)
            .delete(Ctrl.removePointVisite)
            .put(Ctrl.updatePointVisite); 

        app.route('/pointvisite/detail/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getPointVisite);

    }

})();