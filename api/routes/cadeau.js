(function(){
    'use strict';
    module.exports = function(app, acl){
        var Ctrl = require('../controller/cadeau.controller')(acl);
        
        app.route('/cadeau/:id([a-fA-F\\d]{24})')
            .get(Ctrl.listCadeauByEntreprise)
            .delete(Ctrl.removeCadeau)
            .put(Ctrl.updateCadeau); 
        
        app.route('/cadeau/:id([a-fA-F\\d]{24})/:type')
            .post(Ctrl.createCadeau)
            .get(Ctrl.listCadeauByEntrepriseByType)    

        app.route('/cadeau/detail/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getCadeau);
            
        app.route('/cadeau/detail/mobile/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.getCadeauMobile);    
         
        app.route('/cadeau/visite/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.listCadeauByUserByEntrepriseByVisite);

        app.route('/cadeau/visite/:id([a-fA-F\\d]{24})/:entreprise([a-fA-F\\d]{24})') 
            .get(Ctrl.listCadeauClient);    
         
        app.route('/cadeau/achat/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.listCadeauByUserByEntrepriseByAchat);
            
        app.route('/cadeau/length/:id([a-fA-F\\d]{24})') 
            .get(Ctrl.lengthCadeauByEntreprise);
            
        app.route('/verify/cadeau/produit/:id([a-fA-F\\d]{24})')
            .get(Ctrl.verifyCadeauByProduit)

        app.route('/cadeau/archive/:id([a-fA-F\\d]{24})')
            .get(Ctrl.archiveCadeau)
            
    }
})();