"use strict"

const router = require("express").Router()

const { addSymbol,symbolSearch,userSymbollist,deletwatchlistsymbol} = require("../../Controllers/Users/Order.controller")

router.post('/users/addSymbol', addSymbol);
router.post('/users/symbolSearch', symbolSearch);
router.post('/users/symbolSearch', symbolSearch);
router.post('/users/userSymbollist', userSymbollist);
router.post('/users/deletwatchlistsymbol', deletwatchlistsymbol);








module.exports = router;