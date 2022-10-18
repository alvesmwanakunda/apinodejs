(function () {
  'use strict';
  module.exports = function(app, acl){
      var Ctrl = require('../controller/users.controller')(acl);

      /**
       * @swagger
       *  components:
       *    schemas:
       *      Users:
       *          type: object
       *          required:
       *             - email
       *             - password
       *             - role 
       *          properties:
       *             id: 
       *                type: string
       *                description: The auto-generated id of the user
       *             nom:
       *                 type: string
       *                 description: The name of the user
       *             prenom:
       *                    type: string
       *                    description: The first-name of the user
       *             email: 
       *                    type: string
       *                    description: The E-mail of the user
       *             password:
       *                      type: string
       *                      description: The password of the user
       *             role:
       *                 type: string
       *                 description: The role of the user            
       *           
      */

      /**
       * @swagger
       *  tags:
       *    name: Users
       *    description: User management
      */

      /**
       * @swagger
       * /auth:
       *   post:
       *     summary: User authentication
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: authentication successfully
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */
   
      app.route('/auth')
         .post(Ctrl.login);

      /**
       * @swagger
       * /register:
       *   post:
       *     summary: Creating a new user
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: The user was successfully created
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */
      app.route('/register')
         .post(Ctrl.create);

      /**
       * @swagger
       * /reset:
       *   post:
       *     summary: Reset password User
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: The user was successfully created
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */
      app.route('/reset')
         .post(Ctrl.resetPassword);

      /**
       * @swagger
       * /reset/password:
       *   post:
       *     summary: Change password User
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: The user was successfully created
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */
      app.route('/reset/password')
         .post(Ctrl.changePassword);

      
      /**
       * @swagger
       * /reset/password:
       *   post:
       *     summary: Change password User
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: The user was successfully created
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */
       app.route('/reset/password/phone')
       .post(Ctrl.changePasswordCode);   

      /**
       * @swagger
       * /users/exist:
       *   post:
       *     summary: Verification User
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: The user was successfully created
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */
      app.route('/users/exist')
         .post(Ctrl.userExist);
      
      /**
       * @swagger
       * /validcode:
       *   post:
       *     summary: User validation by code 
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: The user was successfully created
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */  
      app.route('/validcode')
         .post(Ctrl.validcode);
         
      /**
       * @swagger
       * /validemail:
       *   post:
       *     summary: User validation by email 
       *     tags: [Users]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/Users'
       *     responses:
       *       200:
       *         description: The user was successfully created
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Users'
       *       500:
       *         description: Some server error
      */  
      app.route('/validemail')
         .post(Ctrl.validemail);
         
      app.route('/profil/password')
         .post(Ctrl.changePasswordProfil);
         
      app.route('/agent/entreprise/:id([a-fA-F\\d]{24})')
         .get(Ctrl.listAgent); 
      
      app.route('/register/agent/entreprise/:id([a-fA-F\\d]{24})')
         .post(Ctrl.createAgent);
         
      app.route('/delete/agent/entreprise/:id([a-fA-F\\d]{24})/:idEntreprise([a-fA-F\\d]{24})')
         .delete(Ctrl.deleteAgent);

      app.route('/user')
         .get(Ctrl.getUser)
         .put(Ctrl.updateProfil);
         
      app.route('/user/client')
         .get(Ctrl.getUserClient);
   
      // agent 
      
      app.route('/agent/:id([a-fA-F\\d]{24})')
         .get(Ctrl.getAgent)
         .put(Ctrl.updateProfilAgent);

      app.route('/notification')
         .post(Ctrl.testNotification);
         
      app.route('/test/message')
         .get(Ctrl.messageTest)   
  }
  
})();