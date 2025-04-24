const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbTradeTools = client.db(process.env.DB_NAME);

const open_position = dbTradeTools.collection("open_position");

module.exports = {
  user: require("./Users.model"),
  role: require("./Role.model"),
  WalletRecharge: require("./WalletRecharge.model"),
  Sign_In: require("./SignIn.model"),
  totalLicense: require("./Licence.model"),
  Symbol: require("./Symbole.model"),
  Userwatchlist: require("./UserWatchlist.model"),
  Order: require("./Order.model"),
  PaymenetHistorySchema: require("./PaymetMethod.model"),
  MarginRequired: require("./MarginReq.model"),
  mainorder_model: require("./Mainorder.model"),
  Statement: require("./statement.model"),
  Favouritelist: require("./Favouritelist.model"),
  BalanceStatement: require("./BalanceStatement.model"),
  user_logs: require("./User_logs.model"),
  forexlivedata: require("./forexlivedata.model"),
  employee_permission: require("./Employeepermission.model"),
  broadcasting: require("./Broadcastmessage.model"),
  Profitmargin: require("./Profitmargin.model"),
  Company: require("./Company.model"),
  live_priceModal: require("./liveprice"),
  ResearchModel : require("./Research"),
  open_position: open_position,
  UpiDetails: require("./UpiDetails"),
  Useraccount: require("./Useraccount"),
  Conversation: require("./Conversation"),
  Message: require("./Message"),
};
