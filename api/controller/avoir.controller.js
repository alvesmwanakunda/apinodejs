(function(){

    "use strict";
    var Avoir = require('../models/avoir.model').AvoirModel;

    module.exports = function(acl, app){

        return{

            updateAvoir:function(req, res, next){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let avoir = await Avoir.findOne({_id:req.params.id});

                        try {

                             avoir.avoir = req.body.avoir;
                             Avoir.findOneAndUpdate({_id:req.params.id},avoir,{new:true},function(err, avoir){

                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        message: avoir
                                    })
                                }
                             })
                            
                        } catch (error){
                            next(error);
                        }
                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })

            },

            getAvoir:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    if(aclres){

                        try {
                            let avoir = await Avoir.findOne({entreprise:req.params.id});
                            res.json(avoir);
                        } catch (error) {
                            res.json(error);  
                        }
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