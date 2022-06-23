(function(){

    "use strict";
    module.exports = function(app,acl){

        var Ctrl = require('../controller/messageClient.controller')(acl);

        app.route('/message/client/:id([a-fA-F\\d]{24})')
        .post(Ctrl.createMessage)
        .get(Ctrl.getMessageClient)
        .put(Ctrl.updateMessageClient)
        .delete(Ctrl.deleteMessageClient);

        app.route('/message/client/:type/:entreprise([a-fA-F\\d]{24})')
           .get(Ctrl.getMessageClientByType) 
    }

})();