(function(){

    "use strict";
    var Zones = require('../models/zones.mode').ZonesModel;

    module.exports = function(acl, app){

        return{

            getZones:function(req, res, next){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                             Zones.find(function(err, zones){

                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        message: zones
                                    })
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