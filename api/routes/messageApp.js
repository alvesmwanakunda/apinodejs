(function(){

    "use strict";
    module.exports = function(app,acl){

        var Ctrl = require('../controller/messageApp.controller')(acl);

        app.route('/messagesApp/client/:id([a-fA-F\\d]{24})')
        .get(Ctrl.listeCountMessageByEntreprise)

        app.route('/detail/messageApp/:id([a-fA-F\\d]{24})/:idEntreprise([a-fA-F\\d]{24})')
          .get(Ctrl.listByMessageClient)

        app.route('/delete/all/message')
           .post(Ctrl.deleteManyMessageClient)  

    }
})();