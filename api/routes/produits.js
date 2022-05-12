(function(){
    'use strict';
    module.exports = function(app, acl){
        var Ctrl = require('../controller/produits.controller')(acl);
        var upload = require("../../middlewares/upload");

        app.post("/produit/entreprise/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.createProduit);

        app.put("/produit/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.updateProduit);

        app.route('/get/produit/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getProduit);

        app.route('/produit/:id([a-fA-F\\d]{24})')
         .get(Ctrl.listProduitByEntreprise)
         .delete(Ctrl.removeProduit);
    }
})();