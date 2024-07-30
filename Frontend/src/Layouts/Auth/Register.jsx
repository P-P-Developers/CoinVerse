import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { SignIn } from "../../Services/Auth/Auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      FullName: "",
      UserName: "",
      PhoneNo: "",
      password: "",
      agree: false,
    },
    validationSchema: Yup.object({
      FullName: Yup.string().required("Full name is required"),
      UserName: Yup.string().required("Username is required"),
      phoneNo: Yup.string()
        .matches(/^[0-9]+$/, "Phone number is not valid")
        .required("Phone number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      agree: Yup.bool().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
    }),

    onSubmit: async (values) => {
      try {
        await SignIn(values);
        Swal.fire({
          icon: "success",
          title: "Registration successful",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/login");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: error.message,
        });
      }
    },
  });

  return (
    <div>
      <div className="vh-100">
        <div className="fix-wrapper">
          <div className="container ">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6">
                <div className="card mb-0 h-auto">
                  <div className="card-body">
                    <div className="text-center mb-2"></div>
                    <h4 className="text-center mb-4">Sign up your account</h4>
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
                        <label className="form-label" htmlFor="phoneNo">
                          Phone Number
                        </label>
                        <input
                          id="phoneNo"
                          type="text"
                          className={`form-control ${
                            formik.touched.phoneNo && formik.errors.phoneNo
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("phoneNo")}
                        />
                        {formik.touched.phoneNo && formik.errors.phoneNo ? (
                          <div className="invalid-feedback">
                            {formik.errors.phoneNo}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          className={`form-control ${
                            formik.touched.password && formik.errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("password")}
                        />
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
                        <input
                          id="confirmPassword"
                          type="password"
                          className={`form-control ${
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("confirmPassword")}
                        />
                        {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword ? (
                          <div className="invalid-feedback">
                            {formik.errors.confirmPassword}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3 form-check">
                        <input
                          id="agree"
                          type="checkbox"
                          className={`form-check-input ${
                            formik.touched.agree && formik.errors.agree
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("agree")}
                        />
                        <label className="form-check-label" htmlFor="agree">
                          I agree to the Terms and Conditions
                        </label>
                        {formik.touched.agree && formik.errors.agree ? (
                          <div className="invalid-feedback">
                            {formik.errors.agree}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3 d-grid">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          disabled={!formik.isValid || formik.isSubmitting}
                        >
                          Register
                        </button>
                      </div>

                      <div className="new-account mt-3 text-center">
                        <p className="font-w500">
                          Already have an account?{" "}
                          <Link className="text-primary" to="/login">
                            Back
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
      </div>
    </div>
  );
};

export default Register;
