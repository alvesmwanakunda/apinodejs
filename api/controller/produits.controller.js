(function(){
    "use strict";
    var Produit = require('../models/produits.model').ProduitModel;
    var fs =  require('fs');

    module.exports = function(acl,app){

        return{

            createProduit(req,res, next){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        //console.log("Body", req.file);

                        var produit = new Produit(req.body);

                        produit.entreprise = req.params.id;

                       

                        if(req.file){

                            try {

                                let path = "./public/" + req.file.filename;

                                fs.readFile(path,{encoding:'base64'}, async (err, data)=>{

                                    if(err){
                                        console.log("Erreur File", err);
                                    }
                                    
                                    produit.photo = data;
                                    produit.save(function(err, produit){

                                        if(err)
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });

                                        fs.unlink(path, (err)=>{
                                            if(err){
                                                console.error(err)
                                                return
                                            }
                                        })    
            
                                        res.json({
                                            success: true,
                                            message:produit
                                        });     
                                    })
                                    
                                });
                                
                            } catch (error) {
                                next(error);
                            }
                        }else{

                            produit.save(function(err, produit){

                                if(err)
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
    
                                res.json({
                                    success: true,
                                    message:produit
                                });     
                            })
                            
                        }
                    }
                    else{
                        return res.status(401).json({
                            success: false,
                            message: "401"
                        });
                    }    
                })    
            },

            listProduitByEntreprise(req,res){

                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Produit.find({entreprise:req.params.id},function(err, produits){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{
                                res.json({
                                    success: true,
                                    message:produits
                                }); 
                            }
                        })

                    }
                    else{
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