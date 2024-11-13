"use strict"

const router = require("express").Router()


const {broadcastmessage , getbroadcastmessage ,getbroadcastmessageforuser} = require("../../Controllers/Admins/Admins/Broadcastmessage");

router.post('/broadcastmessage', broadcastmessage);
router.post('/getbroadcastmessage', getbroadcastmessage);
router.post('/getbroadcastmessageforuser', getbroadcastmessageforuser);





module.exports = router;