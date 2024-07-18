import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { superadmin_header, admin_header } from "./Sidebar_path";

const Sidebar = () => {
  const roles = JSON.parse(localStorage.getItem("user_role"));
  const routes = roles === "SUPERADMIN" ? superadmin_header : admin_header;
  const location = useLocation();

  const [activeRoute, setActiveRoute] = useState(location.pathname);

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  const getIconClass = (name) => {
    switch (name.toLowerCase()) {
      case 'dashboard':
        return 'material-symbols-outlined';
      case 'employees':
      case 'users':
      case 'position':
        return 'fe fe-users';
      case 'transaction':
      case 'withdrawal':
      case 'deposit':
        return 'fe fe-dollar-sign';
      case 'reports':
        return 'fe fe-file-text';
      case 'trade history':
        return 'fe fe-activity';
      case 'login status':
        return 'fe fe-check-square';
      default:
        return '';
    }
  };

  return (
    <div className="dlabnav follow-info">
      <div className="menu-scroll">
        <div className="dlabnav-scroll mm-active">
          <ul className="metismenu mm-show" id="menu">
            {routes && routes.map((data) => (
              <li
                key={data.id}
                className={`mm ${activeRoute === data.route ? 'mm-active' : ''}`}
                onClick={() => setActiveRoute(data.route)}
              >
                <Link to={data.route} aria-expanded="false">
                  <i className={getIconClass(data.name)}></i>
                  <span className="nav-text">{data.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
