"use strict"

const router = require("express").Router()


const {broadcastmessage} = require("../../Controllers/Admins/Admins/Broadcastmessage");

router.post('/broadcastmessage', broadcastmessage);





module.exports = router;