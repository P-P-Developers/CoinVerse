import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";





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

        if (location.pathname === "/register") {
            navigate("/register");
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
            case "EMPLOYEE":
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
            <Route path="/admin/*" element={(roles === "ADMIN") ? <AdminRouting /> : <Login />} />
           

            {/* Add other routes here */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/updatepassword/:id" element={<Update />} />
        </Routes>
    );
}

export default Routing;
