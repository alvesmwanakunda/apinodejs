(function(){
    "use strict";
    module.exports = function(app,acl){

        var Ctrl = require("../controller/dashboard.controller")(acl);

        app.route('/client/info/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getAllInfosClient);

        app.route('/client/info/promotion/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getAllInfosPromotion);

        app.route('/client/info/client/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getAllInfos);

    }
})();