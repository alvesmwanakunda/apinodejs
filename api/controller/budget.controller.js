(function(){

    'use strict';
    var Budget = require('../models/budget.model').BudgetModel;

    module.exports = function(acl,app){

        return{

            createBudget(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let budget = new Budget(req.body);
                        budget.entreprise = req.params.id;
                        budget.save(function(error, budget){

                            if(error){
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }else{
                                res.json({
                                    success: true,
                                    message:budget
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
            
            listBudgetByEntreprise(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){
                    
                    if(aclres){

                        Budget.find({entreprise:req.params.id},function(err, budget){

                            if(err){

                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });

                            }else{

                                res.json({
                                    success: true,
                                    message:budget
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

            updateBudget(req,res, next){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let budget = await Budget.findOne({_id:req.params.id});

                        try {

                            budget.point = req.body.point;
                            budget.achat = req.body.achat;

                            Budget.findOneAndUpdate({_id:req.params.id},budget,{new:true},function(err, budget){
                                if(err){
                                    res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }else{
                                    res.status(200).json({
                                        success:true,
                                        message: budget  
                                    })
                                }
                            })
                            
                        } catch (error) {
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

            removeBudget(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        let budget = await Budget.findOne({_id:req.params.id});
                        budget.remove(function(err, budget){
                            if(err){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: budget
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

            getBudget(req,res){
                acl.isAllowed(req.decoded.id, 'clients', 'create', async function(err, aclres){

                    if(aclres){

                        Budget.findOne({_id:req.params.id}, function(error, budget){
                            if(error){

                                res.status(500).json({
                                    success:false,
                                    message:err
                                })

                            }else{
                                res.status(200).json({
                                    success:true,
                                    message: budget
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
            }
        }
    }


})();