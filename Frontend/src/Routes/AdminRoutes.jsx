import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import Footer from '../components/Dashboard/Footer';
import Dashboard from '../Layouts/Admin/Dashboard';
import Login from "../Layouts/Auth/Login"

const AdminRoutes = () => {
    return (
        <div id="main-wrapper" className='wallet-open show'>
            <Header />
            <Sidebar />
            <div className='content-body'>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/header" element={<Header />} />
                    <Route path="/sidebar" element={<Sidebar />} />
                    <Route path="/footer" element={<Footer />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default AdminRoutes;
