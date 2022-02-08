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
  }
  
})();