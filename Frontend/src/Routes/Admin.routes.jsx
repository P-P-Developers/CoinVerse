import { Routes, Route } from "react-router-dom";
import Header from "../components/Dashboard/Header";
import Sidebar from "../components/Dashboard/Sidebar";
import Footer from "../components/Dashboard/Footer";
import Dashboard from "../Layouts/Admin/Dashboard/Dashboard";
import Login from "../Layouts/Auth/Login";
import Report from "../Layouts/Admin/Tradehistory/Report";
import Tradehistory from "../Layouts/Admin/Tradehistory/Tradehistory";
import Loginstatus from "../Layouts/Admin/Loginstatus/Loginstatus";
import Withdraw from "../Layouts/Admin/Depositeandwithwral/Withdraw";
import Deposit from "../Layouts/Admin/Depositeandwithwral/Deposit";
import Position from "../Layouts/Admin/Position/Position";
import Users from "../Layouts/Admin/Users/Users";
import AddUsers from "../Layouts/Admin/Users/AddUsers";
import Transaction from "../Layouts/Admin/Transactions/Transaction";
import Employee from "../Layouts/Admin/Employee/Employee";
import AddEmployee from "../Layouts/Admin/Employee/AddEmployee";
import Broadcast from "../Layouts/Admin/Brodcast/Broadcast";
import Updateuser from "../Layouts/Admin/Users/Updateuser";
import UpdateEmploye from "../Layouts/Admin/Employee/UpdateEmploye";
import Profile from "../Layouts/Admin/Profile/Profile";
import Changedpassword from "../Layouts/Admin/Profile/Changedpassword";
import Holdoff from "../Layouts/Admin/Holdoff/Holdoff";
import Currency from "../Layouts/Admin/Profile/Currency";
import Signup from "../Layouts/Auth/Signup";
import Brokerage from "../Layouts/Admin/Brokerage/Brokerage";
import AdminTradehistory from "../Layouts/Admin/Tradehistory/Admintradehistory";
import Research from "../Layouts/Admin/Research/Research";
import Basicsetting from "../Layouts/Admin/Profile/Basicsetting";
import Chatbox from "../Layouts/Admin/Chatbox/Chatdash";
import AllUserDetails from "../Layouts/Admin/AllUserDetails/AllUserDetails";
import UserTradeHistory from "../Layouts/Admin/AllUserDetails/UserTradeHistory";

const AdminRoutes = () => {
  return (
    <div id="main-wrapper" className={`wallet-open show `}>
      <Header />
      <Sidebar />
      <div className="content-body" style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/header" element={<Header />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/report" element={<Report />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/tradehistory/:id" element={<Tradehistory />} />
          <Route path="/loginstatus" element={<Loginstatus />} />
          <Route path="/withdrawal" element={<Withdraw />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/position" element={<Position />} />
          <Route path="/holdoff" element={<Holdoff />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/users" element={<Users />} />
          <Route path="/adduser" element={<AddUsers />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/addemployees" element={<AddEmployee />} />
          <Route path="/broadcast" element={<Broadcast />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/changedpassword" element={<Changedpassword />} />
          <Route path="/users/updateuser/:id" element={<Updateuser />} />
          <Route
            path="/employee/updateemploye/:id"
            element={<UpdateEmploye />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tradehistory" element={<AdminTradehistory />} />
          <Route path="/bonus" element={<Brokerage />} />


          <Route path="/all-users-detail" element={<AllUserDetails />} />
          <Route path="/User-tradehistory/:id" element={<UserTradeHistory />} />


          <Route path="/research" element={<Research />} />
          <Route path="/basicsetting" element={<Basicsetting />} />
          <Route path="/chatbox" element={<Chatbox />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRoutes;
