(function(){
    'use strict';
    module.exports = function(app, acl){

        var Ctrl = require('../controller/operation.controller')(acl);

        app.route('/operations/:id([a-fA-F\\d]{24})')
        .get(Ctrl.listeOperationByEntreprise)

        app.route('/operations/list/achat/:id([a-fA-F\\d]{24})')
        .get(Ctrl.listOperationUserByAchat)

        app.route('/operation/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getOperationByClient)

        app.route('/operations/user')
        .get(Ctrl.listOperationByClient)

        app.route('/operation/visite/:id([a-fA-F\\d]{24})/:entreprise([a-fA-F\\d]{24})')
          .get(Ctrl.addPointVisite);

        app.route('/operation/achat/:id([a-fA-F\\d]{24})/:entreprise([a-fA-F\\d]{24})')
          .put(Ctrl.addAchat);
        
        app.route('/operation/cadeau/:id([a-fA-F\\d]{24})/:entreprise([a-fA-F\\d]{24})/:cadeau([a-fA-F\\d]{24})')
          .get(Ctrl.addCadeau);
          
        app.route('/operation/cadeau/client/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listCadeauEntreprise);

        app.route('/web/operation/cadeau/client/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listCadeauWebEntreprise);  

        app.route('/list/detail/cadeau/:id([a-fA-F\\d]{24})')  
           .get(Ctrl.detailListDepenseCadeau)

        app.route('/nombre/detail/cadeau/:id([a-fA-F\\d]{24})')  
           .get(Ctrl.countNombreCadeau)
           
        app.route('/point/detail/cadeau/:id([a-fA-F\\d]{24})')  
           .get(Ctrl.countPointCadeau)   
          
        app.route('/operation/depense/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listDepense); 
          
        app.route('/operation/encaisse/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listEncaisse);
          
        app.route('/depense/length/:id([a-fA-F\\d]{24})') 
          .get(Ctrl.lengthDepense); 
          
        app.route('/encaisse/length/:id([a-fA-F\\d]{24})') 
          .get(Ctrl.lengthEncaisse);
          
        app.route('/operation/encaisse/length/:id([a-fA-F\\d]{24})') 
          .get(Ctrl.lengthEncaisseOperation);  
        //Route avoir
        
        app.route('/operation/avoir/:id([a-fA-F\\d]{24})/:entreprise([a-fA-F\\d]{24})')
          .put(Ctrl.addAvoir);
        
        app.route('/avoir/encaisse/length/:id([a-fA-F\\d]{24})')
          .get(Ctrl.lengthAvoirEncaisse);

        app.route('/avoir/depense/length/:id([a-fA-F\\d]{24})')
          .get(Ctrl.lengthAvoirDepense);

        app.route('/avoir/encaisse/:id([a-fA-F\\d]{24})/:entreprise([a-fA-F\\d]{24})')
          .get(Ctrl.addAvoirDepense);

        app.route('/operation/avoir/depense/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listAvoirDepense); 
          
        app.route('/operation/avoir/encaisse/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listAvoirEncaisse);  
          
        app.route('/get/avoir/encaisse/:id([a-fA-F\\d]{24})')
          .get(Ctrl.getAvoirEncaisse); 
          
          app.route('/count/point/:id([a-fA-F\\d]{24})')
          .get(Ctrl.lengthPointByEntreprise); 
          
          app.route('/count/achat/:id([a-fA-F\\d]{24})')
          .get(Ctrl.lengthAchatByEntreprise); 

          app.route('/depense/entreprise/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listDepenseByEntreprise); 

          app.route('/depense/duplic/entreprise/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listDepenseEntrepriseDuplic); 

          app.route('/count/depense/entreprise/:id([a-fA-F\\d]{24})')
          .get(Ctrl.lengthDepenseByEntreprise);

          //list avoir entreprise

          app.route('/list/avoir/entreprise/:id([a-fA-F\\d]{24})')
          .get(Ctrl.listAvoirByEntreprise);

          app.route('/list/count/entreprise/:id([a-fA-F\\d]{24})')
          .get(Ctrl.countListAvoir);

          app.route('/list/depense/entreprise/:id([a-fA-F\\d]{24})')
          .get(Ctrl.countAvoirDepense);

          app.route('/list/encaisse/entreprise/:id([a-fA-F\\d]{24})')
          .get(Ctrl.countAvoirEncaisse);

          // routes detail client visite, achat, cadeau et avoir

          app.route('/get/client/operation/:id([a-fA-F\\d]{24})')
            .get(Ctrl.getClientByVisite);

          app.route('/get/client/depense/:id([a-fA-F\\d]{24})')
            .get(Ctrl.getClientByDepense) 
            
          app.route('/get/client/avoir/depense/:id([a-fA-F\\d]{24})')
            .get(Ctrl.getClientByAvoirDepense) 
            
          app.route('/get/client/avoir/encaisse/:id([a-fA-F\\d]{24})')
            .get(Ctrl.getClientByAvoirEncaisse)  
    }
})();