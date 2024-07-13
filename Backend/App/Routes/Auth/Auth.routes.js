
"use strict"
const router = require("express").Router()


const { login,SignIn } = require('../../Controllers/Auth/Auth.controller')


router.post('/login', login)
router.post('/SignIn', SignIn)











module.exports = router;


