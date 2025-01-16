"use strict"

const router = require("express").Router()

const { addSymbol, symbolSearch, userSymbollist, deletwatchlistsymbol, getFavouritelist,
    Favouritelist,
    removeFavourite
} = require("../../Controllers/Users/Symbol.controller")
const { placeorder, getOrderBook, gettardehistory, position, holding, Squareoff, switchOrderType,UpdateTargetSlPRice } = require("../../Controllers/Users/Placeorder.controller")
const { userWithdrawalanddeposite, getpaymenthistory, getUserDetail, getmarginpriceforuser, getAllstatement,

    getuserorderdata,
    getAllUsers,
    todaysBroadcastMessage,
    balanceStatementForUser,
    tradeStatementForUser,
    generatePin,
    matchPin,
    changePin,
    tradeStatementForOrder
} = require("../../Controllers/Users/Users.controller")
const { statement } = require("../../Controllers/Users/Statement.controller")

router.post('/users/addSymbol', addSymbol);
router.post('/users/symbolSearch', symbolSearch);
router.post('/users/userSymbollist', userSymbollist);
router.post('/users/deletwatchlistsymbol', deletwatchlistsymbol);
router.post('/users/placeorder', placeorder);
router.post('/userWithdrawalanddeposite', userWithdrawalanddeposite);
router.post('/getpaymenthistory', getpaymenthistory);
router.get('/getAllUsers', getAllUsers);

router.post('/getUserDetail', getUserDetail);
router.post('/getOrderBook', getOrderBook);
router.post('/gettardehistory', gettardehistory);
router.post('/position', position);
router.post('/holding', holding);
router.post('/statement', statement);
router.post('/getmarginvalue', getmarginpriceforuser);
router.post('/getFavouritelist', getFavouritelist);
router.post('/Favouritelist', Favouritelist);
router.post('/removeFavourite', removeFavourite)
router.post('/getAllstatement', getAllstatement);
router.post('/getuserorderdata', getuserorderdata);
router.post('/Squareoff', Squareoff);

router.post('/balanceStatementForUser', balanceStatementForUser);
router.post('/tradeStatementForUser', tradeStatementForUser);
router.post('/tradeStatementForOrder', tradeStatementForOrder);
router.post('/todaysBroadcastMessage', todaysBroadcastMessage);
router.post('/user/generateMPin', generatePin)
router.post('/user/matchPin', matchPin);
router.post('/user/changePin', changePin);

router.post('/switchOrderType', switchOrderType);
router.post('/UpdateTargetSlPRice', UpdateTargetSlPRice);





module.exports = router;