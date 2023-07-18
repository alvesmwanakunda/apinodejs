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

        app.route('/messages/client/:id([a-fA-F\\d]{24})')
           .get(Ctrl.getCountMessageUser)

        app.route('/verify/qrcode/message/:id([a-fA-F\\d]{24})/:entreprise([a-fA-F\\d]{24})')
           .get(Ctrl.getMessageByQrcode)

         app.route('/verify/qrcode/message/formulaire/:entreprise([a-fA-F\\d]{24})')
           .post(Ctrl.messageFormulaireQrcode)
         

    }
})();