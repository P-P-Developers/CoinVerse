import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  superadmin_header,
  admin_header,
  employee_header,
} from "./Sidebar_path";
import { getEmployee_permissiondata } from "../../Services/Employee/Employee";

const Sidebar = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const roles = JSON.parse(localStorage.getItem("user_role"));
  const routes =
    roles === "SUPERADMIN"
      ? superadmin_header
      : roles === "ADMIN"
      ? admin_header
      : employee_header;
  const location = useLocation();

  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const [getaccess, setGetaccess] = useState({});

  const getpermission = async () => {
    try {
      const data = { id: user_id };
      const response = await getEmployee_permissiondata(data);
      if (response.status) {
        setGetaccess(response.data[0]);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getpermission();
  }, [user_id]);

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  const getIconClass = (name) => {
    switch (name.toLowerCase()) {
      case "dashboard":
        return "fa-solid fa-house";
      case "employees":
        return "fa-solid fa-users";
      case "users":
        return "fa fa-user";
      case "position":
        return "fa fa-id-badge";
      case "transaction":
        return "fa-solid fa-money-bill-transfer";
        case "license history":
          return "fa-solid fa-money-bill-transfer";
      case "withdrawal":
        return "fa-solid fa-money-simple-from-bracket";
      case "deposit":
        return "fa-sharp fa-light fa-money-bill";
      case "reports":
        return "fa fa-file-text";
      case "trade history":
        return "fa-sharp fa-solid fa-clock-rotate-left";
      case "login status":
        return "fa-solid fa-signal-bars";
      case "broadcast":
        return "fa-solid fa-tower-broadcast";
      case "hold off":
        return "fa-solid fa-power-off";
      case "available positions":
        return "fa-solid fa-crosshairs";
      case "admin":
        return "fa fa-user";
      case "currency setup":
        return "fa-regular fa-coin";
      case "sign up":
        return "fa-solid fa-right-to-bracket";
      case "brokerage":
        return "fa fa-hand-holding-usd";
           case "bonus":
        return "fa fa-hand-holding-usd";
        case "research":
          return "fa-solid fa-money-bill-transfer";
          case "chat-box":
            return "fa-solid fa-comments";
      default:
        return "";
    }
  };

  return (
    <div className="dlabnav follow-info">
      <div className="menu-scroll">
        <div className="dlabnav-scroll mm-active">
          <ul className="metismenu mm-show" id="menu">
            {routes &&
              routes.map((data) => {
                if (
                  (roles === "EMPLOYE" &&
                    data.name.toLowerCase() === "available positions" &&
                    getaccess.open_position !== 1) ||
                  (roles === "EMPLOYE" &&
                    data.name.toLowerCase() === "trade history" &&
                    getaccess.trade_history !== 1)
                ) {
                  return null;
                }

                return (
                  <li
                    key={data.id}
                    className={`mm ${
                      activeRoute === data.route ? "mm-active" : ""
                    }`}
                    onClick={() => setActiveRoute(data.route)}
                  >
                    <Link to={data.route} aria-expanded="false">
                      <i className={getIconClass(data.name)}></i>
                      <span className="nav-text">{data.name}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
