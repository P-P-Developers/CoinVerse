
"use strict"
const router = require("express").Router()


const { login,SignIn,getSignIn } = require('../../Controllers/Auth/Auth.controller')


router.post('/login', login)
router.post('/SignIn', SignIn)
router.get('/getSignIn', getSignIn)











module.exports = router;


