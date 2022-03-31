(function(){

    'use strict';
    module.exports = function(app, acl){

        var Ctrl = require('../controller/promotions.controller')(acl);
        var upload = require("../../middlewares/upload");

        app.post("/promotion/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.createPromotion);

        app.put("/promotion/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.updatePromotion);

        app.route('/promotion/:id([a-fA-F\\d]{24})')
         .get(Ctrl.getPromotion)
         .delete(Ctrl.deletePromotion);

        app.route('/promotion/entreprise/:id([a-fA-F\\d]{24})')
         .get(Ctrl.lisPromotions);

    }
})();