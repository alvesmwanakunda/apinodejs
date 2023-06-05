(function(){
    'use strict';
    module.exports = function(app, acl){

        var Ctrl = require('../controller/zones.controller')(acl);

        app.route('/zones')
        .get(Ctrl.getZones)

    }
})();