import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  LogoutUser,
  getbroadcastmessageforuser,
} from "../../Services/Admin/Addmin";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import { getCompanyApi } from "../../Services/Superadmin/Superadmin";

import { getUserFromToken } from "../../Utils/TokenVerify";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socket_url, socket_url_web, base_url } from "../../Utils/Config";

const Header = () => {

  const socket = io(socket_url_web, {
    transports: ["websocket"],
    withCredentials: true,
  });


  const location = useLocation();
  const TokenData = getUserFromToken();
  const user_role = TokenData?.Role?.toUpperCase();
  const user_id = TokenData?.user_id;
  const exp = TokenData?.exp;

  const [isActive, setIsActive] = useState(false);
  const [notification, setNotification] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [logo, setLogo] = useState("");




  useEffect(() => {
    fetchLogo();
  }, []);



  useEffect(() => {
    if (user_id) getNotifications();
  }, [user_id]);



  useEffect(() => {
    const timeLeft = exp * 1000 - Date.now();
    if (timeLeft <= 0) return logoutuser();
    const timeout = setTimeout(logoutuser, timeLeft);
    return () => clearTimeout(timeout);
  }, [exp]);



  useEffect(() => {

    // socket.on("connect", () => {
    //   console.log("🚀 Socket connected successfully with ID:", socket.id);
    // })

    socket.on("newMessage", (msg) => {
      if (user_id === msg.parent_id) {
        setNotification((prev) => [
          {
            _id: msg._id || new Date().getTime(),
            message: msg.message,
            createdAt: new Date(),
            UserName: msg.senderInfo?.UserName || "User"
          },
          ...prev,
        ]);

        toast.info(
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              📩 {msg.senderInfo?.UserName || "User"} Send a Message On chatbox
            </div>
            <div>Message : {msg.message}</div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        )
      }
    });


    socket.on("newTransactionRequest", (msg) => {
      if (user_id === msg.adminid) {
        setNotification((prev) => [
          {
            _id: msg._id || new Date().getTime(),
            Amount: msg.amount,
            createdAt: new Date(),
            UserName: msg.UserName || "User"
          },
          ...prev,
        ]);

        toast.info(
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              📩 {msg.UserName || "User"} Send Request To {msg.type}
            </div>
            <div>Amount : {msg.amount}</div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        )
      }
    });
    return () => {
      socket.off("newMessage");
      socket.off("newTransactionRequest");
    };
  }, [user_id]);



  const getNotifications = async () => {
    try {
      const response = await getbroadcastmessageforuser({ userid: user_id });
      if (response.status)
        setNotification(response.data);

    } catch (error) {
      console.log("error", error)
    }
  };



  useEffect(() => {

    document.body.setAttribute("data-theme-version", theme);
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
  }, [theme]);




  useEffect(() => {
    const element = document.querySelector(".wallet-open.show");

    if (element) {
      if (isActive) {
        element.classList.add("menu-toggle");
      } else {
        element.classList.remove("menu-toggle");
      }
    } else {
    }
  }, [isActive]);



  const changeFavicon = (iconPath) => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconPath;
  };

  const fetchLogo = async () => {
    const res = await getCompanyApi();
    setLogo(res.data.logo);
    changeFavicon(res.data.favicon);
    localStorage.setItem("Port", res?.data?.port)
    document.title = res.data.panelName;
  };

  const toggleHamburger = () => {
    setIsActive((prev) => !prev);
    const element = document.querySelector(".wallet-open.show.active");

    if (element) {
      element.classList.toggle("menu-toggle");
    } else {
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    document.body.setAttribute("data-theme-version", newTheme);
    document.body.className = newTheme === "dark" ? "dark-mode" : "light-mode";
    document.querySelector(".dz-theme-mode").classList.toggle("active");

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme preference to localStorage
  };


  const logoutuser = async () => {
    try {
      const response = await LogoutUser({ userid: user_id });
      if (response.status) localStorage.clear();
    } catch (error) { }
  };





  const getLastPathSegment = (path) => {
    const segments = path
      .split("/")
      .filter((segment) => isNaN(segment.charAt(0)));
    return segments[segments.length - 1] || segments[segments.length - 2];
  };

  const formattedSegment =
    getLastPathSegment(location.pathname)?.charAt(0).toUpperCase() + getLastPathSegment(location.pathname)?.slice(1)



  const pageTitles = {
    Admin: "Add Admin",
    Addmin: "Add Admin", // typo fix bhi cover ho gaya
    Adduser: "Add User",
    Loginstatus: "Login Status",
    Adminuser: "Admin Users",
    Adminemployee: "Admin Employees",
    Position: "Available Position",
    Tradehistory: "Trade History",
    Holdoff: "Hold Off",
    Changedpassword: "Changed Password",
    Addemployees: "Add Employee",
    Basicsetting: "Basic Settings",
  };

  const title = pageTitles[formattedSegment] || formattedSegment;

  return (
    <div>
      <div
        className="header-banner"
        style={{ backgroundImage: "url(/assets/images/bg-1.png)" }}
      ></div>

      <div className="nav-header">
        <a href="index.html" className="">
          <img src={logo} width={"250px"} height={"83px"} alt="" className="w-100" />

          <div className="brand-title"></div>
        </a>

        <div className="nav-control">
          <div
            className={`hamburger ${isActive ? "is-active" : ""}`}
            onClick={toggleHamburger}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>

      <div className="header home">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left"></div>
              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link dz-theme-mode" onClick={toggleTheme}>
                    {/* {theme.includes("light") ? ( */}
                    <i
                      id="icon-light"
                      className="fas fa-sun"
                      style={{ color: "#ffff" }}
                    />
                    {/* // ) : ( */}
                    <i
                      id="icon-dark"
                      className="fas fa-moon"
                      style={{ color: "#ffff" }}
                    />
                    {/* // )} */}
                  </a>
                </li>
                {user_role === "ADMIN" && (
                  <li className="nav-item dropdown notification_dropdown">
                    <a
                      href="#"
                      className="nav-link"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-bell" style={{ color: "white" }} />
                    </a>
                    <div className="dropdown-menu dropdown-menu-end of-visible">
                      <div
                        id="DZ_W_Notification3"
                        className="widget-media dlab-scroll p-3"
                        style={{ maxHeight: 380, overflowY: "auto" }}
                      >
                        <ul className="timeline">
                          {notification.length === 0 ? (
                            <p className="text-center text-muted">
                              No new notifications
                            </p>
                          ) : (
                            notification.map((item) => (
                              <li key={item.id}>
                                <div className="timeline-panel">
                                  <div className="media me-2">
                                    <img
                                      alt={`Avatar of ${item.UserName}`}
                                      width={40}
                                      src="/assets/images/avatar/1.png"
                                    />
                                  </div>
                                  <div className="media-body">
                                    <h6 className="mb-1">{item.message}</h6>
                                    <small className="d-block">
                                      {fDateTime(item.createdAt)}
                                    </small>
                                  </div>
                                  <h6 className="mb-4">{item.UserName}</h6>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                      {notification.length != 0 && (
                        <a href="#" className="all-notification">
                          See all notifications <i className="ti-arrow-end" />
                        </a>
                      )}
                    </div>
                  </li>
                )}
                <li>
                  <div className="dropdown header-profile2">
                    <a
                      className="nav-link"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="header-info2 d-flex align-items-center">
                        <img src="/assets/images/avatar/1.png" alt="" />
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      {user_role === "ADMIN" && (
                        <Link
                          to="/admin/profile"
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fas fa-user"
                            style={{ fontSize: "18px", color: "#000" }}
                          />
                          <span className="ms-2">Profile</span>
                        </Link>
                      )}
                      {user_role === "SUPERADMIN" && (
                        <Link
                          to="/superadmin/bankdetails"
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fas fa-university"
                            style={{ fontSize: "18px", color: "#000" }}
                          />
                          <span className="ms-2">Bank Details</span>
                        </Link>
                      )}
                      {user_role === "ADMIN" && (
                        <Link
                          to="/admin/basicsetting"
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fas fa-cog"
                            style={{ fontSize: "18px", color: "#000" }}
                          />
                          <span className="ms-2">Basic Setting</span>
                        </Link>
                      )}
                      {user_role === "SUPERADMIN" && (
                        <Link
                          to="/superadmin/system"
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fas fa-cogs"
                            style={{ fontSize: "18px", color: "#000" }}
                          />
                          <span className="ms-2">System</span>
                        </Link>
                      )}
                      {(user_role === "ADMIN" || user_role === "EMPLOYE") && (
                        <Link
                          to={`/${user_role === "ADMIN" ? "admin" : "employee"
                            }/changedpassword`}
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fas fa-lock"
                            style={{ fontSize: "18px", color: "#000" }}
                          />
                          <span className="ms-2">Change Password</span>
                        </Link>
                      )}
                      <Link
                        to="/login"
                        className="dropdown-item ai-icon"
                        onClick={logoutuser}
                      >
                        <i
                          className="fas fa-sign-out-alt"
                          style={{ fontSize: "18px", color: "#fd5353" }}
                        />
                        <span className="ms-2 text-danger">Logout</span>
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="page-titles">
          <div className="sub-dz-head">
            <div className="d-flex align-items-center dz-head-title">
              <h2 className="text-white m-0">{title}</h2>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>

  );
};

export default Header;
