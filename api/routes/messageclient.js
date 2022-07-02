(function(){

    "use strict";
    module.exports = function(app,acl){

        var Ctrl = require('../controller/messageClient.controller')(acl);
        var upload = require("../../middlewares/upload");


        app.post("/message/client/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.createMessage);

        app.post("/message/client/:id([a-fA-F\\d]{24})/:client([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.createMessageTest);

        app.put("/message/client/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.updateMessageClient);

        app.route('/message/client/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getMessageClient)
        .delete(Ctrl.deleteMessageClient);

        app.route('/message/client/test')
           .post(Ctrl.testMessage)
           
        app.route('/message/client/:type/:entreprise([a-fA-F\\d]{24})')
           .get(Ctrl.getMessageClientByType) 
    }

})();