(function(){
    'use strict';
    module.exports = function(app, acl){
        var Ctrl = require('../controller/typesPoint.controller')(acl);

        app.route('/types/:id([a-fA-F\\d]{24})')
            .get(Ctrl.listPointByEntreprise);
              
    }
})();