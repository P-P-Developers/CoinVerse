import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Dashboard/Header";
import Sidebar from "../components/Dashboard/Sidebar";
import Footer from "../components/Dashboard/Footer";
import Dashboard from "../Layouts/Superadmin/DASHBOARD/Dashboard";
import Admin from "../Layouts/Superadmin/Admins/Admin";
import AddAdmin from "../Layouts/Superadmin/Admins/AddAdmin";
import Transection from "../Layouts/Superadmin/Transection/Transection";
import Position from "../Layouts/Superadmin/Admins/Position";
import Broadcast from "../Layouts/Superadmin/Admins/Broadcast";
import Holdoff from "../Layouts/Superadmin/Admins/Holdoff";
import UpdateAdmin from "../Layouts/Superadmin/Admins/UpdateAdmin";

import AdminUser from "../Layouts/Superadmin/Admins/AdminUser";
import Adminemployee from "../Layouts/Superadmin/Admins/Adminemployee";

import AdminBonus from "../Layouts/Superadmin/Admins/Bonus";
import System from "../Layouts/Superadmin/Admins/System";
import SuperAdminTradeHistory from "../Layouts/Superadmin/Admins/SuperAdminTradeHistory";
import Bankdetails from "../Layouts/Admin/Profile/Bankdetails";

import Deposite from "../Layouts/Superadmin/withdrawalAnddeposite/Deposit";
import Withdrawal from "../Layouts/Superadmin/withdrawalAnddeposite/Withdrawal";
import UserDetails from "../Layouts/Superadmin/Admins/UserDetails";
import UserTradeHistory from "../Layouts/Superadmin/Admins/UserTradeHistory";

const SuperadminRoutes = () => {
  return (
    <div id="main-wrapper" className="wallet-open show">
      <Header />
      <Sidebar />
      <div className="content-body">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/position" element={<Position />} />
          <Route path="/addmin" element={<AddAdmin />} />
          <Route path="/license-history" element={<Transection />} />
          <Route path="/admin/updateadmin/:id" element={<UpdateAdmin />} />
          <Route path="/broadcast" element={<Broadcast />} />
          <Route path="/holdoff" element={<Holdoff />} />
          <Route path="/admin/adminuser/:id" element={<AdminUser />} />
          <Route path="/admin/adminemployee/:id" element={<Adminemployee />} />
          <Route path="/bonus" element={<AdminBonus />} />
          <Route path="/system" element={<System />} />
          <Route path="/tradehistory" element={<SuperAdminTradeHistory />} />
          <Route path="/bankdetails" element={<Bankdetails />} />

          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/deposit" element={<Deposite />} />
          <Route path="/All-users" element={<UserDetails />} />
          <Route path="/user-Trade-history" element={<UserTradeHistory />} />


        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default SuperadminRoutes;
