import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import Footer from '../components/Dashboard/Footer';
import Dashboard from '../Layouts/Superadmin/Dashboard';


const SuperadminRoutes = () => {
    return (
        <div id="main-wrapper" className='wallet-open show'>
            <Header />
            <Sidebar />
            <div className='content-body'>
                <Routes>
                    
                    <Route path="/dashboard" element={<Dashboard />} />

                </Routes>
            </div>
            <Footer />

        </div>
    );
}

export default SuperadminRoutes;
