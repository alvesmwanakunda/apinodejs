(function(){
    'use strict';
    var TypesPoint =  require('../models/typesPoint.model').TypesPointModel;

    module.exports = function(acl,app){

        return {

            listPointByEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        TypesPoint.find({entreprise:req.params.id},function(err, types){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:types
                                });

                            }

                        });

                    }else{

                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });

                    }
                })
            },
        }
    }
})();