import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Dashboard/Header";
import Sidebar from "../components/Dashboard/Sidebar";
import Footer from "../components/Dashboard/Footer";
import Dashboard from "../Layouts/Superadmin/Dashboard";
import Admin from "../Layouts/Superadmin/Admins/Admin";
import AddAdmin from "../Layouts/Superadmin/Admins/AddAdmin";
import Transection from "../Layouts/Superadmin/Transection/Transection";
import Position from "../Layouts/Superadmin/Admins/Position";
import Broadcast from "../Layouts/Superadmin/Admins/Broadcast";
import Holdoff from "../Layouts/Superadmin/Admins/Holdoff";
import UpdateAdmin from "../Layouts/Superadmin/Admins/UpdateAdmin";
import Currency from "../Layouts/Superadmin/Admins/Currency";
import AdminUser from "../Layouts/Superadmin/Admins/AdminUser";
import Adminemployee from "../Layouts/Superadmin/Admins/Adminemployee";
import Employee_user from "../Layouts/Superadmin/Admins/Employee_user";
import Brokerage from "../Layouts/Superadmin/Brokerage";
import AdminBrokerage from "../Layouts/Superadmin/Admins/Brokerage";
import System from "../Layouts/Superadmin/Admins/System";
import Tradehistory from "../Layouts/Admin/Admintradehistory";
import SuperAdminTradeHistory from "../Layouts/Superadmin/Admins/SuperAdminTradeHistory";
import Bankdetails from "../Layouts/Admin/Bankdetails"


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
          <Route path="/brokerage" element={<Brokerage />} />
          <Route path="/brokerage/:id" element={<AdminBrokerage />} />
          <Route path="/system" element={<System />} />
          <Route path="/tradehistory" element={<SuperAdminTradeHistory/>} />
          <Route path="/bankdetails" element={<Bankdetails />} />

        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default SuperadminRoutes;
