(function(){

    'use strict';
    var entrepriseService = require('../services/entreprises.service');

    module.exports = function(acl, app){

        return {
            
            getUserByEntreprise(req, res){

                acl.isAllowed(req.decoded.id, 'clients', 'retreive', async function(err, aclres){

                   if(aclres){

                        try {
                            let entreprise = await entrepriseService.getEntrepriseByUser(req.decoded.id);
                            res.json(entreprise);
                        } catch (error) {
                            res.json(error);  
                        }

                   } else{

                       return res.status(401).json({
                           success: false,
                           message:"401"
                       })

                   }
                })
            }
        }
    }

})();