(function () {
   'use strict'; 
   module.exports = function(app, acl){
       var Ctrl = require('../controller/clients.controller')(acl);
       var upload = require("../../middlewares/upload");

        /**
       * @swagger
       *  components:
       *    schemas:
       *      Clients:
       *          type: object
       *          required:
       *             - email
       *             - phone
       *             - genre
       *             - nom
       *             - prenom
       *             - adresse 
       *          properties:
       *             id: 
       *                type: string
       *                description: The auto-generated id of the client
       *             nom:
       *                 type: string
       *                 description: The name of the client
       *             prenom:
       *                    type: string
       *                    description: The first-name of the client
       *             email: 
       *                    type: string
       *                    description: The E-mail of the client
       *             genre:
       *                      type: string
       *                      description: The sexe of the client
       *             adresse:
       *                 type: string
       *                 description: The adresse of the client            
       *           
      */

       /**
       * @swagger
       *  tags:
       *    name: Clients
       *    description: Client management
      */
       
       /**
       * @swagger
       * /client/idEntreprise:
       *   post:
       *     summary: Create client
       *     tags: [Clients]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Clients'
       *     responses:
       *       200:
       *         description: successfully
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Clients'
       *       500:
       *         description: Some server error
      */
       app.route('/client/:id([a-fA-F\\d]{24})')
         .post(Ctrl.createClient);

      /**
       * @swagger
       * /client:
       *   post:
       *     summary: Create client
       *     tags: [Clients]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Clients'
       *     responses:
       *       200:
       *         description: successfully
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Clients'
       *       500:
       *         description: Some server error
      */
       app.route('/client')
         .post(Ctrl.addClient);   

      /**
     * @swagger
     * /clients/entreprise/idEntreprise:
     *   get:
     *     summary: Returns clients by entreprise
     *     tags: [Clients]
     *     responses:
     *       200:
     *         description: clients per company
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Clients'
     */ 
     app.route('/clients/entreprise/:id([a-fA-F\\d]{24})')
         .get(Ctrl.getAllClientsByEntreprise);

      /**
     * @swagger
     * /client/idClient:
     *   get:
     *     summary: Returns client
     *     tags: [Clients]
     *     responses:
     *       200:
     *         description: client infos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Clients'
     */ 
     app.route('/client/:id([a-fA-F\\d]{24})')
         .get(Ctrl.getClientById);   

     /*app.route("/upload/client", upload.single("uploadfile"))
        .post(Ctrl.uploadClient); */
      app.post("/upload/client/:id([a-fA-F\\d]{24})", upload.single("uploadfile"),Ctrl.uploadClient); 
      
      app.route('/delete/client/entreprise/:id([a-fA-F\\d]{24})/:idEntreprise([a-fA-F\\d]{24})')
         .delete(Ctrl.deleteClient);
        
      app.route('/delete/client/:id([a-fA-F\\d]{24})')
         .post(Ctrl.deleteManyClient);   
   };

})();