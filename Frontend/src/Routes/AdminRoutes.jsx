import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import Footer from '../components/Dashboard/Footer';
import Dashboard from '../Layouts/Admin/Dashboard';

const AdminRoutes = () => {
    return (
        <div>
        <div id="main-wrapper" className='wallet-open show'>
                <Header />
                <Sidebar />
                <div className='content-body'>
                    <Dashboard />
                </div>
                <Footer />
       </div>
       
            <Router>
                <Routes>
                
                    <Route exact path="/header" element={<Header />} />
                    <Route exact path="/sidebar" element={<Sidebar />} />

                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/footer" element={<Footer />} />
                </Routes>
            </Router>
        </div>
    );
}

export default AdminRoutes;
