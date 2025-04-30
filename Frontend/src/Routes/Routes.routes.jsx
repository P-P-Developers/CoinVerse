import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from '../Layouts/Auth/Login';
import Dashboard from '../Layouts/Admin/Dashboard';
import Superadminroutes from './Superadminroutes';
import Adminroutes from './AdminRoutes';
import EmployeeRoutes from './Employeeroutes';
import Register from '../Layouts/Auth/Register';




const Routing = () => {
    const location = useLocation();

    const navigate = useNavigate();
    const roles = JSON.parse(localStorage.getItem('user_role'));
    const user_details = JSON.parse(localStorage.getItem("user_details"));


    useEffect(() => {
        if (location.pathname.startsWith("/updatepassword")) {
            navigate(location.pathname);
            return;
        }

        if (location.pathname === "/forget") {
            navigate("/forget");
            return;
        }

        if (location.pathname.startsWith("/register")) {
       
            // navigate(location.pathname);
            return;
        }


        if (!user_details || !roles || user_details === "null" || roles === "null" || location.pathname === "/login") {
            navigate("/login");
            return;
        }


        switch (roles) {
            case "SUPERADMIN":
                if (location.pathname === "/login" || location.pathname === "/" || !location.pathname.startsWith("/superadmin")) {
                    navigate("/superadmin/dashboard");
                }
                break;
            case "ADMIN":
                if (location.pathname === "/login" || location.pathname === "/" || !location.pathname.startsWith("/admin")) {
                    navigate("/admin/dashboard");
                }
                break;
            case "USER":
                if (location.pathname === "/login" || location.pathname === "/" || !location.pathname.startsWith("/user")) {
                    navigate("/user/dashboard");
                }
                break;
            case "EMPLOYE":
                if (location.pathname === "/login" || location.pathname === "/" || !location.pathname.startsWith("/employee")) {
                    navigate("/employee/dashboard");
                }
                break;
            default:
                break;
        }
    }, [navigate, location.pathname, roles, user_details]);


    return (
        <Routes>
            <Route path="/superadmin/*" element={(roles === "SUPERADMIN") ? <Superadminroutes /> : <Login />} />

            <Route path="/admin/*" element={(roles === "ADMIN") ? <Adminroutes /> : <Login />} />

            <Route path="/employee/*" element={(roles === "EMPLOYE") ? <EmployeeRoutes /> : <Login />} />


            <Route path="/login" element={<Login />} />
            <Route path="/register/:id" element={<Register />} />

            <Route path="/register" element={<Register />} />


        </Routes>
    );
}

export default Routing;
