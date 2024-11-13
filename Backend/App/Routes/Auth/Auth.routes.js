
"use strict"
const router = require("express").Router()


const { login,SignIn,getSignIn,logoutUser,getlogsuser , PasswordChanged} = require('../../Controllers/Auth/Auth.controller')


router.post('/login', login)
router.post('/SignIn', SignIn)
router.get('/getSignIn', getSignIn)
router.post('/logoutUser', logoutUser)
router.post('/getlogsuser', getlogsuser)
router.post('/PasswordChanged', PasswordChanged)











module.exports = router;


