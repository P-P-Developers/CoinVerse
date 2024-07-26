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
        return 'fa fa-envelope-open';
      case 'employees':
        return 'fa fa-calendar';
      case 'users':
        return 'fa fa-user';
      case 'position':
        return 'fa fa-id-badge';
      case 'transaction':
        return 'fa fa-folder-open';
      case 'withdrawal':
        return 'fa fa-hdd';
      case 'deposit':
        return 'fa fa-snowflake';
      case 'reports':
        return 'fa fa-file-text';
      case 'trade history':
        return 'fa fa-address-card';
      case 'login status':
        return 'fa fa-check-square';
      case 'broadcast':
        return 'fa fa-sticky-note';
      case 'hold off':
        return 'fa fa-refresh';
      case 'available positions':
        return 'fa fa-paper-plane';
      case 'admin':
        return 'fa fa-check-square';
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
