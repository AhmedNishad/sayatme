let mongoose = require('mongoose')
const async = require('async')
let User = require('../models/user')
let Sayat = require('../models/sayat')

const { body, validationResult } = require('express-validator/check')

const { sanitizeBody } = require('express-validator/filter')

exports.get_users = (req,res,next)=>{

    User.find()
    .exec((err, list_users)=>{
        let sortedUsers = list_users.sort((a,b)=>{
            let query =  a.date_added>b.date_added ? -1 : a.date_added<b.date_added ? 1 : 0;
            return query
        }) 
        let reducedArray = sortedUsers.slice(0, 100)
        
        console.log(sortedUsers)
        if(err) next(err)
        res.render('index', {users:reducedArray})
    })
}

exports.get_user_sayats = (req, res, next)=>{
    User.findById(req.params.id).populate('sayat')
    .exec((err, results)=>{
        if(err) next(err)
        let sortedSayats = results.sayats.sort((a,b)=>{
            let query =  a.date_added>b.date_added ? -1 : a.date_added<b.date_added ? 1 : 0;
            return query
        }) 
        let reducedArray = sortedSayats.slice(0, 100)
        res.render('sayats',{titles:"Sayat List for user",user: results.name, sayats: sortedSayats})
    })
}

exports.create_user_sayat = [
    
    body('sayat', "You got to Say Something!").isLength({min: 1}),

    sanitizeBody('sayat').escape(),

    (req, res, next)=>{
        const errors = validationResult(req)
        
        let sayatInstance = new Sayat ({
            description: req.body.sayat
        })

        if(!errors.isEmpty()){

            console.log("we have probelems")
            return
        }else{
            User.findById(req.params.id).then((user)=>{
                user.sayats.push(sayatInstance)
                user.save((err)=>{
                    if(err) next(err)
                     res.redirect(user._id);
                })
            })
        }
    }

]

exports.create_user_get = (req, res, next)=>{
    
    res.render('create_user', {title: "Create User"})
}

exports.create_user_post = [

    sanitizeBody('email').escape().trim(),
    sanitizeBody('password').escape().trim(),
    sanitizeBody('user').escape().trim(),

    (req,res,next)=>{
        let errors = validationResult(req)
        let newUserInstance = new User({
            name: req.body.user,
            password: req.body.password,
            email: req.body.email
        })
        if(!errors.isEmpty){
            console.log("There are errors in create user post" + errors )
        }else{

            User.find({name:req.body.user}).exec((err, result_user_match)=>{

                User.find({email: req.body.email}).exec((err, result_email_match)=>{

                    
                    if(Object.keys(result_user_match).length){
                        res.render('create_user', {title: "Create User", error: "This user already exists"})
                        return
                    }
                    
                    if(Object.keys(result_email_match).length){
                        res.render("create_user", {title:"Create User", error:"This email has been taken"})
                        return
                    } 
                    
               
                    newUserInstance.save(function(err){
                        if(err) next(err)

                        res.redirect('/user');
                    })

                })

                

            })
            
        }
    }

]
    


