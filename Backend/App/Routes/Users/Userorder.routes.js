"use strict"

const router = require("express").Router()

const { addSymbol,symbolSearch,userSymbollist,deletwatchlistsymbol} = require("../../Controllers/Users/Symbol.controller")
const {placeorder ,getOrderBook , gettardehistory ,position,holding } = require("../../Controllers/Users/Placeorder.controller")
const {userWithdrawalanddeposite,getpaymenthistory, getUserDetail , getmarginpriceforuser} = require("../../Controllers/Users/Users.controller")
const {statement} = require("../../Controllers/Users/Statement.controller")


router.post('/users/addSymbol', addSymbol);
router.post('/users/symbolSearch', symbolSearch);
router.post('/users/symbolSearch', symbolSearch);
router.post('/users/userSymbollist', userSymbollist);
router.post('/users/deletwatchlistsymbol', deletwatchlistsymbol);
router.post('/users/placeorder',placeorder);
router.post('/userWithdrawalanddeposite',userWithdrawalanddeposite);
router.post('/getpaymenthistory',getpaymenthistory);
router.post('/getUserDetail',getUserDetail);
router.post('/getOrderBook',getOrderBook);
router.post('/gettardehistory',gettardehistory);
router.post('/position',position);
router.post('/holding',holding);
router.post('/statement',statement);
router.post('/getmarginvalue',getmarginpriceforuser);









module.exports = router;