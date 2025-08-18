"use strict"

const router = require("express").Router()

const { addSymbol, symbolSearch, userSymbollist, deletwatchlistsymbol, getFavouritelist,
    Favouritelist,
    removeFavourite,
    DeletePendingOrder,
    UpdatePendingOrder
} = require("../../Controllers/Users/Symbol.controller")
const { getLedgerReport, placeorder, getOrderBook, gettardehistory, position, holding, Squareoff, switchOrderType, getSwitchOrderType, UpdateTargetSlPRice, GetModifyOrder, ConvertPosition } = require("../../Controllers/Users/Placeorder.controller")
const { userWithdrawalanddeposite, getpaymenthistory, getUserDetail, getmarginpriceforuser, getAllstatement,

    getuserorderdata,
    getAllUsers,
    todaysBroadcastMessage,
    balanceStatementForUser,
    tradeStatementForUser,

    tradeStatementForOrder,
    tradeStatementForUser1,
    getUserAccountDetails,
    updateUserAccountDetails

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
router.post('/tradeStatementForUser', tradeStatementForUser);   // Trade Statnment
router.post('/tradeStatementForUser1', tradeStatementForUser1);


router.post('/tradeStatementForOrder', tradeStatementForOrder);   //Position par
router.post('/todaysBroadcastMessage', todaysBroadcastMessage);



router.post('/switchOrderType', switchOrderType);
router.post('/getSwitchOrderType', getSwitchOrderType);
router.post('/UpdateTargetSlPRice', UpdateTargetSlPRice);

router.post('/open/order', GetModifyOrder);

router.post('/getUserAccountDetails', getUserAccountDetails);
router.post('/updateUserAccountDetails', updateUserAccountDetails);

router.post('/getledgerreport', getLedgerReport);
router.post('/deletePendingOrder', DeletePendingOrder);
router.post('/updatePendingOrder', UpdatePendingOrder);

router.post('/convertPosition', ConvertPosition);





module.exports = router;