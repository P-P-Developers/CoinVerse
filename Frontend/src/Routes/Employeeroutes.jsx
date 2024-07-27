import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import Footer from '../components/Dashboard/Footer';
import Dashboard from '../Layouts/Employee/Dashboard';
import Login from "../Layouts/Auth/Login"
import Report from '../Layouts/Employee/Report';
import Tradehistory from '../Layouts/Employee/Tradehistory';
import Loginstatus from '../Layouts/Employee/Loginstatus';
import Withdraw from '../Layouts/Employee/Withdraw';
import Deposit from '../Layouts/Employee/Deposit';
import Position from '../Layouts/Employee/Position';

import Users from '../Layouts/Employee/Users/Users';
import AddUsers from '../Layouts/Employee/Users/AddUsers';
import Transaction from '../Layouts/Employee/Transactions/Transaction';

import Broadcast from '../Layouts/Employee/Broadcast';
import Updateuser from '../Layouts/Employee/Users/Updateuser';

import Profile from '../Layouts/Employee/Profile';
import Setting from '../Layouts/Employee/Setting';




const EmployeeRoutes = () => {
    const [isMenuToggled, setIsMenuToggled] = useState(false);

    const handleToggleClick = () => {
        setIsMenuToggled(!isMenuToggled);
    }
    return (
        <div id="main-wrapper" className={`wallet-open show ${isMenuToggled ? 'menu-toggle' : ''}`}>
            <Header />
            <Sidebar />
            <div className='content-body'>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/header" element={<Header />} />
                    <Route path="/sidebar" element={<Sidebar />} />
                    <Route path="/footer" element={<Footer />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tradehistory" element={<Tradehistory />} />
                    <Route path="/loginstatus" element={<Loginstatus />} />
                    <Route path="/withdrawal" element={<Withdraw />} />
                    <Route path="/deposit" element={<Deposit />} />
                    <Route path="/position" element={<Position />} />
                 
            
                    <Route path="/users" element={<Users />} />
                    <Route path="/adduser" element={<AddUsers />} />
                    <Route path="/transaction" element={<Transaction />} />
                   
                 
                    <Route path="/broadcast" element={<Broadcast />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/users/updateuser/:id" element={<Updateuser />} />
                   



                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default EmployeeRoutes;
