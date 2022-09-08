(function(){

    "use strict";
    var qrCodeService = require('../services/qrCode.service');
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
            }

        }
    }

})();