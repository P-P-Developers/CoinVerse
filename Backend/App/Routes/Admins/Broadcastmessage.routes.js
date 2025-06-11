"use strict"

const router = require("express").Router()


const {broadcastmessage , getbroadcastmessage ,getbroadcastmessageforuser,GetNews} = require("../../Controllers/Admins/Admins/Broadcastmessage");

router.post('/broadcastmessage', broadcastmessage);
router.post('/getbroadcastmessage', getbroadcastmessage);
router.post('/getbroadcastmessageforuser', getbroadcastmessageforuser);

router.get('/GetNews', GetNews);



module.exports = router;