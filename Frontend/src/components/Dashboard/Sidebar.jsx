import React from "react";
import { Link } from "react-router-dom";
import { superadmin_header, admin_header } from "./Sidebar_path";

const Sidebar = () => {
  const roles = JSON.parse(localStorage.getItem("user_role"));
  console.log("roles", roles);

  var Routes = roles == "SUPERADMIN" ? superadmin_header : admin_header;

  return (
    <div className="dlabnav follow-info">
      <div className="menu-scroll">
        <div className="dlabnav-scroll mm-active">
          <ul className="metismenu mm-show" id="menu">
            {Routes &&
              Routes.map((data, index) => (
                <li key={index} className="mm-active">
                  <Link to={data.route} aria-expanded="false">
                    <i className={data.Icon}></i>
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
