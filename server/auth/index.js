const express = require('express')
const router = express.Router()
const Joi  = require('@hapi/joi')

const db  = require('../db/connections')
const users = db.get('users')
users.createIndex('username', {unique: true})


//saddsa

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp("(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}).*$"))
        .required(),
})

router.get ('/', (req, res)=> {
    res.json({
        message: "This route is Working"
    })
})

router.post('/signup', (req, res)=>{
//Working validation 
    // const validation = schema.validate(req.body)
    // let {error} = validation
    // if (error){
    //     return res.json(error.message)
    // }else{
    //     return res.json({message : "all chill"})
    // }

    const validation = schema.validate(req.body)
    let {error} = validation
    if (error){
        return res.json(error)
        
    }else{
        users.insert({ username: req.body.username, password: req.body.password })
        return res.json({message : "all chill"})
        
    }

    
  

    const body = Object.values(req.body)
    for (let i=0; i<body.length; i++) {
        console.log(body[i])
    }
        
    
    
    
 
    
})

module.exports = router