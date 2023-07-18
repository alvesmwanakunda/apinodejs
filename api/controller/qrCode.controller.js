(function(){

    "use strict";
    var qrCodeService = require('../services/qrCode.service');
    var messageClient = require('../models/messageClient.model').MessageClientModel;
    var Promotion = require('../models/promotions.model').PromotionsModel;
    var fs = require("fs");

    module.exports = function(acl,app){

        return{

            getQrCodeUser:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        //"./public/logo.png";

                        let image = "./public/logo.png";

                        let qrCode = await qrCodeService.user_qrcode(req.decoded.id,image,50,50);

                        if(qrCode){

                            res.status(200).json({
                                success:true,
                                qrCode: qrCode
                            })

                        }else{
                            res.status(500).json({
                                success:false,
                                qrCode:"Error qrCode"
                            })
                        }

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            },
            
            getQrCodeCadeau:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        //"./public/logo.png";

                        let image = "./public/logo.png";

                        let code = req.params.id+","+req.decoded.id;

                        let qrCode = await qrCodeService.cadeau_qrcode(code,100,50);

                        if(qrCode){

                            res.status(200).json({
                                success:true,
                                qrCode: qrCode
                            })

                        }else{
                            res.status(500).json({
                                success:false,
                                qrCode:"Error qrCode"
                            })
                        }

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            },

            getQrCodeAvoir:function(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        //"./public/logo.png";

                        let image = "./public/logo.png";

                        let code = req.params.id;

                        let qrCode = await qrCodeService.avoir_qrcode(code,100,50);

                        if(qrCode){

                            res.status(200).json({
                                success:true,
                                qrCode: qrCode
                            })

                        }else{
                            res.status(500).json({
                                success:false,
                                qrCode:"Error qrCode"
                            })
                        }

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            },

            getQrCodePromotion:function(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let messageclient = await messageClient.findOne({type:req.params.type,entreprise:req.params.entreprise});
                        if(messageclient){
                            let code = messageclient.code;

                            if(messageclient.isCode){
                                let qrCode = await qrCodeService.promotion_qrcode(code,100,50);
                                if(qrCode){
    
                                    res.status(200).json({
                                        success:true,
                                        qrCode: qrCode
                                    })
        
                                }else{
                                    res.status(500).json({
                                        success:false,
                                        qrCode:"Error qrCode"
                                    })
                                }
                            }else{
                                res.status(200).json({
                                    success:false,
                                    qrCode: "Pas de code"
                                })
                            }

                        }else{

                            res.status(200).json({
                                success:false,
                                qrCode: "Pas de code"
                            })

                        }

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            },

            getQrCodePromotionGlobal:function(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let promotion = await Promotion.findOne({_id:req.params.id});
                        if(promotion){
                            let code = promotion.code;
                            if(promotion.isCode){
                                let qrCode = await qrCodeService.promotion_qrcode(code,100,50);
                                if(qrCode){
    
                                    res.status(200).json({
                                        success:true,
                                        qrCode: qrCode
                                    })
        
                                }else{
                                    res.status(500).json({
                                        success:false,
                                        qrCode:"Error qrCode"
                                    })
                                }
                            }else{
                                res.status(200).json({
                                    success:false,
                                    qrCode: "Pas de code"
                                })
                            }

                        }else{

                            res.status(200).json({
                                success:false,
                                qrCode: "Pas de code"
                            })

                        }

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            },

            /*getQrCodePMobile:function(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let messageclient = await messageClient.findOne({_id:req.params.id});
                        if(messageclient){
                            let code = messageclient.code;

                            let qrCode = await qrCodeService.promotionMobile_qrcode(code,100,50)
                            if(qrCode){
    
                                res.status(200).json({
                                    success:true,
                                    qrCode: qrCode
                                })
    
                            }else{
                                res.status(500).json({
                                    success:false,
                                    qrCode:"Error qrCode"
                                })
                            }

                        }else{

                            res.status(200).json({
                                success:false,
                                qrCode: "Pas de code"
                            })

                        }

                    }else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }
                })
            }*/

        }
    }

})();