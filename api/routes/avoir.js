(function(){
    'use strict';
    module.exports = function(app, acl){

        var Ctrl = require('../controller/avoir.controller')(acl);

        app.route('/avoir/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getAvoir)
        .put(Ctrl.updateAvoir); 
    }
})();