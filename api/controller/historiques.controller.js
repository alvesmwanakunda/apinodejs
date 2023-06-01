(function(){

    "use strict";
    var Historiques = require('../models/historiques.model').HistoriquesModel;

    module.exports = function(acl,app){

        return{

              listHistoriqueByUserEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        Historiques.find({entreprise:req.params.id, client:req.params.idClient},function(err, historiques){

                            if(err){
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:historiques
                                });

                            }

                        })

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