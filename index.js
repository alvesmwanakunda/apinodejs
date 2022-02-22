const express = require('express'); //Import the express dependency
const app = express(); 
const fs = require('fs');
const http = require('http').Server(app);
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
/*var multer =  require('multer');
var storage =  multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public');
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }
});
var uploadClient = multer({
  storage:storage
});
var excelToJson = require('convert-excel-to-json');*/


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

const port = PARAMS.NODE_PORT; //Save the port number
const MONGO_URL = PARAMS.DB_URL;
const cors = require('cors');
//global.__basedir = __dirname + "/..";


if(process.env.NODE_ENV !=="production"){
  require("dotenv").config();
}

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
  app.get('/', (req, res)=> res.send('Koonda API ready'));   
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
          //console.log("Decoded", decoded);
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
  /*app.post('/upload/client', uploadClient.single('uploadfile'), function(req, res, next){

    var token = req.headers.token;
    if(token){
      jwt.verify(token, config.certif, function(err, decoded){
        if(err){
          return res.status(401).json({
            success:false,
            message: 'Failed to authenticate token.'
          });
        } else{
          req.decoded = decoded;
          acl.addUserRoles(req.decoded.id, Encryption.decrypt(req.decoded.role));
          console.log("File", req.file) 
          if(req.file){

            let path =__dirname+ "/public/" + req.file.filename;
            console.log("Path", path);
            const excelData = excelToJson({
                          sourceFile:path,
                          sheets:[{
                              name:'clients',
                              header:{
                                  rows:1
                              },
                              columnToKey:{
                                  A:'nom',
                                  B:'prenom',
                                  C:'emailorphone',
                                  D:'genre',
                                  E:'adresse'
                              }
                          }]
            });
            console.log("Data Excel", excelData);

          }else{
            return res.status(500).json({
                      success: false,
                      message: err
            });
          }
          
        }
      })
    }

  });*/

  var routes = Files.walk(__dirname + "/api/routes");
  //console.log("Routes", routes);
  for(var i=0; i < routes.length; i++)
     if(routes[i].indexOf("routes") !==1) require(routes[i])(app,acl);
              
  app.listen(port,()=>{
      console.log(`Now listening on port ${port}`);
  });
  
}

