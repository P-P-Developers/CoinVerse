

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { SignIn } from "../../Services/Auth/Auth"; // Ensure this service is properly defined
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getCompanyApi } from "../../Services/Superadmin/Superadmin";


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();
  const [logo, setLogo] = useState('');

  var ReferalCode = location.pathname.split('/');

  console.log(ReferalCode);

  const query = new URLSearchParams(search);
  const refCode = ReferalCode[2]



  useEffect(() => {
    fetchLogo();
  }, [])

  const fetchLogo = async () => {
    const res = await getCompanyApi()
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = res.data.favicon;
    document.getElementsByTagName("head")[0].appendChild(link);

    document.title = res.data.panelName;

    setLogo(res.data.logo);
    changeFavicon(res.data.favicon);
  }

  const changeFavicon = (iconPath) => {
    const link = document.querySelector("favicon") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = iconPath;
    document.getElementsByTagName("head")[0].appendChild(link);
  };


  const formik = useFormik({
    initialValues: {
      FullName: "",
      UserName: "",
      PhoneNo: "",
      password: "",
      confirmPassword: "",
      ReferredBy: refCode || "", 
    },
    validationSchema: Yup.object({
      FullName: Yup.string().required("Full name is required"),
      UserName: Yup.string().required("Username is required"),
      PhoneNo: Yup.string()
        .matches(/^[0-9]+$/, "Phone number is not valid")
        .required("Phone number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      ReferredBy: Yup.string().required("Referral code is required"), 
    }),
    onSubmit: async (values) => {
      const { confirmPassword, ...dataToSubmit } = values;

      try {
        const response = await SignIn(dataToSubmit);

        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Registration successful",
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate("/login");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Registration failed",
            text: response.message || "An error occurred. Please try again.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text:
            error.response?.data?.message ||
            "An error occurred. Please try again.",
        });
      }
    },
  });

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      <div className="login-aside text-center d-flex flex-column flex-row-auto">
        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-lg-4 mb-2 pt-5 logo">
            <img src={logo} style={{ height: "100px" }} alt="Logo" />
          </div>
          <h3 className="mb-2 text-white">Welcome back!</h3>
          {/* <p className="mb-4">
            User Experience &amp; Interface Design <br />
            Strategy SaaS Solutions
          </p> */}
        </div>

        <div
          className="aside-image position-relative"
          style={{
            backgroundImage: "url(/assets/images/background/pic-2.png)",
          }}
        >
          <img
            className="img1 move-1"
            src="assets/images/background/pic3.png"
            alt=""
          />
          <img
            className="img2 move-2"
            src="assets/images/background/pic4.png"
            alt=""
          />
          <img
            className="img3 move-3"
            src="assets/images/background/pic5.png"
            alt=""
          />
        </div>
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6">
            <div className="card mb-0 h-auto">
              <div className="card-body">
                <div className="text-center mb-3">
                  
                </div>

                <h2 className="text-center mb-2">Sign Up</h2>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="FullName">
                      Full Name
                    </label>
                    <input
                      id="FullName"
                      type="text"
                      className={`form-control ${
                        formik.touched.FullName && formik.errors.FullName
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("FullName")}
                    />
                    {formik.touched.FullName && formik.errors.FullName ? (
                      <div className="invalid-feedback">
                        {formik.errors.FullName}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="UserName">
                      Username
                    </label>
                    <input
                      id="UserName"
                      type="text"
                      className={`form-control ${
                        formik.touched.UserName && formik.errors.UserName
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("UserName")}
                    />
                    {formik.touched.UserName && formik.errors.UserName ? (
                      <div className="invalid-feedback">
                        {formik.errors.UserName}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="PhoneNo">
                      Phone Number
                    </label>
                    <input
                      id="PhoneNo"
                      type="text"
                      className={`form-control ${
                        formik.touched.PhoneNo && formik.errors.PhoneNo
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("PhoneNo")}
                    />
                    {formik.touched.PhoneNo && formik.errors.PhoneNo ? (
                      <div className="invalid-feedback">
                        {formik.errors.PhoneNo}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("password")}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control ${
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("confirmPassword")}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }>
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <div className="invalid-feedback">
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="ReferredBy">
                      Referral Code
                    </label>
                    <input
                      id="ReferredBy"
                      type="text"
                      className={`form-control ${
                        formik.touched.ReferredBy && formik.errors.ReferredBy
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("ReferredBy")}
                    />
                    {formik.touched.ReferredBy && formik.errors.ReferredBy ? (
                      <div className="invalid-feedback">
                        {formik.errors.ReferredBy}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3 d-grid">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={!formik.isValid || formik.isSubmitting}>
                      Register
                    </button>
                  </div>

                  <div className="new-account mt-3 text-center">
                    <p className="font-w500">
                      Already have an account?{" "}
                      <Link className="text-primary" to="/login">
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
