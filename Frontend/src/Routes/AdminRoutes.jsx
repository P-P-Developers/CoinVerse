import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import Footer from '../components/Dashboard/Footer';
import Dashboard from '../Layouts/Admin/Dashboard';
import Report from '../Layouts/Admin/Report';


const AdminRoutes = () => {
    return (
        <div id="main-wrapper" className='wallet-open show'>
            <Header />
            <Sidebar />
            <div className='content-body'>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/header" element={<Header />} />
                    <Route path="/sidebar" element={<Sidebar />} />
                    <Route path="/footer" element={<Footer />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/report" element={<Report />} />
                   
                </Routes>
            </div>
            <Footer />
            
        </div>
    );
}

export default AdminRoutes;
