import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import Footer from '../components/Dashboard/Footer';
import Dashboard from '../Layouts/Superadmin/Dashboard';
import Admin from '../Layouts/Superadmin/Admins/Admin';
import AddAdmin from '../Layouts/Superadmin/Admins/AddAdmin';
import Transaction from '../Layouts/Superadmin/Admins/Transaction';
import Position from '../Layouts/Superadmin/Admins/Position';


const SuperadminRoutes = () => {
    return (
        <div id="main-wrapper" className='wallet-open show'>
            <Header />
            <Sidebar />
            <div className='content-body'>
                <Routes>

                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/adddmin" element={<AddAdmin />} />
                    <Route path="/transaction" element={<Transaction />} />
                    <Route path="/position" element={<Position />} />

                </Routes>
            </div>
            <Footer />

        </div>
    );
}

export default SuperadminRoutes;
