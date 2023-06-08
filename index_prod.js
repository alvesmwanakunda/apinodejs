const express = require('express');
const app = express(); 
const fs = require('fs');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server,{
    cors:{origin: '*'}
});
const apiNamespace = io.of('/api/socket.io');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const node_acl = require('acl');
const roles =  require("./api/models/roles.model");
const Files = require("./files");
const compression = require("compression");
var jwt = require('jsonwebtoken');
const Encryption = require('./utils/Encryption');
const config = require('./config');
var path = require('path');
var cron = require('node-cron');
var functionsCron = require('./api/services/functionCron');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "API Support",
        url: "http://www.exmaple.com/support",
        email: "support@example.com",
      },
    },

    servers: [
      {
        url: "http://localhost:4001",
        description: "My API Documentation",
      },
    ],
  },
  apis: ["./api/routes/*.js"],
};
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const specs = swaggerJsDoc(options);
const PARAMS = require("./parameter");


const cors = require('cors');
//global.__basedir = __dirname + "/..";


if(process.env.NODE_ENV !=="production"){
  require("dotenv").config();
}

const port = process.env.PORT || 8100;
const MONGO_URL = process.env.MONGODB_URI;

var acl = new node_acl(new node_acl.memoryBackend());

mongoose.Promise = global.Promise;
mongoose.connection.openUri(
  MONGO_URL,{},
  err=>{
    if(err){
      console.log(`MongoBD connection error:${err}`);
      process.exit(1);
    }
    console.log(`MongoBD connection done`);
    roles.find({},(err, roles)=> {
      acl.allow(roles);
      initApp();
    }) 
  }
);
function initApp(){

  app.use(
    bodyParser.urlencoded({
      extended:true
    })
  );
  app.use(
    bodyParser.json({
      limit:"50mb"
    })
  );
  app.use(
    bodyParser.urlencoded({
      limit:'50mb',
      extended:true
    })
  );
  app.use(compression());
  app.use(express.json({extended:false}));
  app.use(cors());
  app.use(express.static(path.join(__dirname,'public')));
  app.use(express.json({limit:'50mb'}));

  app.use(function(req,res,next){
    res.setHeader("Acces-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","token, Content-Type, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", true);
    if (req.method == "OPTIONS") return res.sendStatus(200);
    next();
  });
  app.get('/', (req, res)=> res.send('Weefid API ready'));   
  app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(specs)); 
  app.use(function(req,res,next){
    var token =  req.headers.token;
    if(token){
      jwt.verify(token,config.certif, async function(err, decoded){
        if(err){
          return res.status(401).json({
            successs:false,
            message: 'Failed to authenticate token.'
          });
        }else{
          req.decoded = decoded;
          global.infosUser = decoded;
          acl.addUserRoles(req.decoded.id, Encryption.decrypt(req.decoded.role));
          next();
        }
      });
    } else {
      req.decoded = {
        id: "guest"
      };
      acl.addUserRoles(req.decoded.id, "guest");
      next();
    }
  }); 
  

  var routes = Files.walk(__dirname + "/api/routes");
  for(var i=0; i < routes.length; i++)
     if(routes[i].indexOf("routes") !==1) require(routes[i])(app,acl);

  cron.schedule("0 0 0 * * *", async function () {

      functionsCron.AnniversaireClientApp();
      functionsCron.RelancerApp();
      functionsCron.AnniversaireClientSms();
      functionsCron.RelancerSms();
      functionsCron.PromotionApp();
      functionsCron.PromotionAppSms();
      functionsCron.PromotionAppWefid();
      functionsCron.PromotionSmsWefid();
      console.log("Cron application");
  }); 

  global.io = apiNamespace;

  apiNamespace.on('connection', (socket)=>{
    global.socket = socket;
    console.log("Socket run");
  })
              
  server.listen(process.env.PORT,()=>{
      console.log(`Now listening on port ${process.env.PORT}`);
  });
}

