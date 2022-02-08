const express = require('express'); //Import the express dependency
const app = express(); 
const fs = require('fs');
const http = require('http').Server(app);
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const node_acl = require('acl');
const roles =  require("./models/roles.model");
const Files = require("./files");
const compression = require("compression");
var path = require('path');

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
  apis: ["./routes/*.js"],
};
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const specs = swaggerJsDoc(options);
const PARAMS = require("./parameter");

const port = PARAMS.NODE_PORT; //Save the port number
const MONGO_URL = PARAMS.MONGO_URL;

const cors = require('cors');
/*const corsOptions={
  origin:'http://localhost:5000',
  credentials:true,
  optionsSuccessStatus:200
}*/
app.use(cors());

if(process.env.NODE_ENV !=="production"){
  require("dotenv").config();
}
app.use(express.json());

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
  app.use(express.static(path.join(__dirname,'public')));
  app.use(express.json({
    limit:'50mb'
  }));
  app.use(function(req,res,next){
    res.setHeader("Acces-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","token, Content-Type, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", true);
    if (req.method == "OPTIONS") return res.sendStatus(200);
    next();
  });


  var routes = Files.walk(__dirname + "/routes");
  console.log("Routes", routes);
  for(var i=0; i < routes.length; i++)
     if(routes[i].indexOf("routes") !==1) require(routes[i])(app,acl);
                  
  app.listen(port,()=>{
      console.log(`Now listening on port ${port}`);
  });
  app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(specs));
}

