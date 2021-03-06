(function(){

    'use strict';
    module.exports = function(app, acl){
        var Ctrl = require('../controller/qrCode.controller')(acl);
        
        app.route('/qrcode/user') 
            .get(Ctrl.getQrCodeUser); 
            
        app.route('/qrcode/cadeau/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getQrCodeCadeau);
            
        app.route('/qrcode/avoir/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getQrCodeAvoir);    
    }

})();