import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Dashboard/Header";
import Sidebar from "../components/Dashboard/Sidebar";
import Footer from "../components/Dashboard/Footer";
import Dashboard from "../Layouts/Admin/Dashboard";
import Login from "../Layouts/Auth/Login";
import Report from "../Layouts/Admin/Report";
import Tradehistory from "../Layouts/Admin/Tradehistory";
import Loginstatus from "../Layouts/Admin/Loginstatus";
import Withdraw from "../Layouts/Admin/Withdraw";
import Deposit from "../Layouts/Admin/Deposit";
import Position from "../Layouts/Admin/Position";
// import Employee from '../Layouts/Admin/Employee';
import User from "../Layouts/Admin/User";
// import Transaction from '../Layouts/Admin/Transaction';
import Users from "../Layouts/Admin/Users/Users";
import AddUsers from "../Layouts/Admin/Users/AddUsers";
import Transaction from "../Layouts/Admin/Transactions/Transaction";
import Employee from "../Layouts/Admin/Employee/Employee";
import AddEmployee from "../Layouts/Admin/Employee/AddEmployee";
import Broadcast from "../Layouts/Admin/Broadcast";
import Updateuser from "../Layouts/Admin/Users/Updateuser";
import UpdateEmploye from "../Layouts/Admin/Employee/UpdateEmploye";
import Profile from "../Layouts/Admin/Profile";
import Changedpassword from "../Layouts/Admin/Changedpassword";
import Holdoff from "../Layouts/Admin/Holdoff";
import Currency from "../Layouts/Admin/Currency";
import Signup from "../Layouts/Admin/Signup";
import Brokerage from "../Layouts/Admin/Brokerage";

import AdminTradehistory from "../Layouts/Admin/Admintradehistory";

const AdminRoutes = () => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);

  const handleToggleClick = () => {
    setIsMenuToggled(!isMenuToggled);
  };
  return (
    <div
      id="main-wrapper"
      className={`wallet-open show ${isMenuToggled ? "menu-toggle" : ""}`}
    >
      <Header />
      <Sidebar />
      <div className="content-body">
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

          {/* <Route path="/employees" element={<Employee />} /> */}
          {/* <Route path="/users" element={<User />} /> */}
          {/* <Route path="/transaction" element={<Transaction />} /> */}

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
          <Route path="/brokerage" element={<Brokerage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRoutes;
