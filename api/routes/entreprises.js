(function(){

    'use strict';
    module.exports = function(app, acl){

        var Ctrl = require('../controller/entreprises.controller')(acl);
        var upload = require("../../middlewares/upload");

       /**
       * @swagger
       *  components:
       *    schemas:
       *      Entreprises:
       *          type: object
       *          required:
       *             - createur 
       *          properties:
       *             id: 
       *                type: string
       *                description: The auto-generated id of the entreprise
       *             nom:
       *                 type: string
       *                 description: The name of the entreprise
       *             phone1:
       *                    type: string
       *                    description: The phone 1 of the entreprise
       *             phone2: 
       *                    type: string
       *                    description: The phone 2 of the entreprise
       *             description:
       *                      type: string
       *                      description: The description of the entreprise
       *             adresse:
       *                 type: string
       *                 description: The adresse of the client            
       *           
      */

       /**
       * @swagger
       *  tags:
       *    name: Entreprise
       *    description: Entreprise management
      */
      
     /**
     * @swagger
     * /entreprise/user:
     *   get:
     *     summary: Returns entreprise by user
     *     tags: [Entreprises]
     *     responses:
     *       200:
     *         description: company per user
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Entreprises'
     */ 
     app.route('/entreprise/user')
         .get(Ctrl.getUserByEntreprise);
         
     app.route('/entreprise/:id([a-fA-F\\d]{24})')
         .put(Ctrl.udpateEntreprise)
         .get(Ctrl.getEntrepriseByCategorie);

    app.route('/entreprises')
        .get(Ctrl.getEntrepriseByCategorie);

    app.route('/entreprises/comparaison')
        .get(Ctrl.comparaisonListEntreprise);    
        
    app.route('/entreprises/visiter')
        .get(Ctrl.getEntrepriseByUserVisiter);
        
    app.route('/visiter/entreprise/id/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getEntrepriseByIdVisiteur);    

         
     app.put("/entreprise/image/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.uploadLogo);

     app.route('/entreprise/id/:id([a-fA-F\\d]{24})')
        .get(Ctrl.getEntrepriseById);

    app.route('/shared/entreprise/:id([a-fA-F\\d]{24})')
        .get(Ctrl.sharedGetEntrepriseById);   


    }
})();