(function(){

    "use strict";
    var Operation = require('../models/operation.model').OperationModel;
    var operationService = require('../services/operation.service');

    module.exports = function(acl,app){

        return{

            listeOperationByEntreprise:function(req, res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let operations = await operationService.listOperationByEntreprise(req.params.id);
                        res.json({
                            success: true,
                            message: operations
                        });
                    }else{
                      return res.status(401).json({
                       success: false,
                       message: "401"
                      });
                    }
                })

            },
            
            getOperationByClient:function(req,res) {

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                 
                    if(aclres){

                        let operation = await Operation.findOne({client:req.params.id});
                        res.json({
                            success: true,
                            message: operation
                        });

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }

                })
            }
        }
    }

})();