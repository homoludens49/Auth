const express = require('express')
const router = express.Router()
const Joi  = require('@hapi/joi')
const bcrypt  = require('bcryptjs')
const db  = require('../db/connections')
const users = db.get('users')
users.createIndex('username', {unique: true})




const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp("(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}).*$"))
        .trim()
        .required(),
})

router.get ('/', (req, res)=> {
    res.json({
        message: "This route is Working"
    })
})

router.post('/signup', (req, res, next)=>{
//Working validation 
    // const validation = schema.validate(req.body)
    // let {error} = validation
    // if (error){
    //     return res.json(error.message)
    // }else{
    //     return res.json({message : "all chill"})
    // }

    const validation = schema.validate(req.body)
    console.log(validation.error)
    if ( validation.error == null){
        users.findOne({
            username: req.body.username
        }).then(user => {
            if(user){ 
                const error = new Error('A user with this name already exists')
                next(error)
            }else{
                bcrypt.hash(req.body.password.trim(), 8).then(hashedPassword =>{
                    const newUser = {
                        username: req.body.username, 
                        password:hashedPassword
                    }
                    users.insert(newUser).then(insertedUser => {
                        delete insertedUser.password
                        res.json(insertedUser)
                    }) 
                })
            }
        })
    }else{
        next(validation.error)
    }

})

module.exports = router