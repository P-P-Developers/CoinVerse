
import React, { useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import {
  createOrUpdateCompanyApi,
  getCompanyApi,
} from "../../../Services/Superadmin/Superadmin"; // Assuming this is your API call
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

Modal.setAppElement("#root");

const System = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    panelName: Yup.string()
      .required("Panel Name is required")
      .min(3, "Panel Name must be at least 3 characters"),
    logo: Yup.string().required("Logo is required"),
    favicon: Yup.string().required("Favicon is required"),
    loginImage: Yup.string().required("Login Image is required"),
  });

  const initialValues = {
    panelName: "",
    logo: "",
    favicon: "",
    loginImage: "",
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    try {
      const res = await createOrUpdateCompanyApi(values);
      if (res.status) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.message || "Company settings updated successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while submitting the form. Please try again.",
      });
    }
  };

  const fetchCompaniesData = async () => {
    setIsLoading(true);
    // Simulating an API call for loading companies data
    const res = await getCompanyApi({});
    console.log("res is ", res);
    setCompaniesData(res.data);
    setIsLoading(false);
  };
  console.log("companies : ", companiesData);

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-lg" style={{ marginTop: "50px" }}>
            <div className="card-header bg-primary text-white">
              <h4 className="text-center text-white mb-0">System Settings</h4>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsModalOpen(true);
                  fetchCompaniesData();
                }}>
                <h4 className="text-center text-white mb-0">All Companies</h4>
              </button>
            </div>
            <div className="card-body">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ setFieldValue, errors, touched }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="panelName" className="form-label">
                          Panel Name
                        </label>
                        <Field
                          type="text"
                          name="panelName"
                          id="panelName"
                          className={`form-control ${
                            errors.panelName && touched.panelName
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Panel Name"
                        />
                        {errors.panelName && touched.panelName && (
                          <div className="invalid-feedback">
                            {errors.panelName}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="logo" className="form-label">
                          Logo
                        </label>
                        <input
                          type="file"
                          id="logo"
                          name="logo"
                          className={`form-control ${
                            errors.logo && touched.logo ? "is-invalid" : ""
                          }`}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            const base64 = await convertToBase64(file);
                            setFieldValue("logo", base64);
                          }}
                        />
                        {errors.logo && touched.logo && (
                          <div className="invalid-feedback">{errors.logo}</div>
                        )}
                        <small className="text-muted">
                          Choose a logo image from your gallery.
                        </small>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="favicon" className="form-label">
                          Favicon
                        </label>
                        <input
                          type="file"
                          id="favicon"
                          name="favicon"
                          className={`form-control ${
                            errors.favicon && touched.favicon
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            const base64 = await convertToBase64(file);
                            setFieldValue("favicon", base64);
                          }}
                        />
                        {errors.favicon && touched.favicon && (
                          <div className="invalid-feedback">
                            {errors.favicon}
                          </div>
                        )}
                        <small className="text-muted">
                          Upload a favicon file (16x16px).
                        </small>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="loginImage" className="form-label">
                          Login Image
                        </label>
                        <input
                          type="file"
                          id="loginImage"
                          name="loginImage"
                          className={`form-control ${
                            errors.loginImage && touched.loginImage
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            const base64 = await convertToBase64(file);
                            setFieldValue("loginImage", base64);
                          }}
                        />
                        {errors.loginImage && touched.loginImage && (
                          <div className="invalid-feedback">
                            {errors.loginImage}
                          </div>
                        )}
                        <small className="text-muted">
                          Upload a background image for the login page.
                        </small>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary w-100">
                          Save
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to display companies data */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Companies Data"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for the modal
          },
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            zIndex: "9999", // Ensure it's above other content
            width: "90%", // 90% of the screen width
            maxWidth: "800px", // Limit max width
            height: "80vh", // Increase modal height to 80% of viewport height
            overflowY: "hidden", // Prevent scrolling in modal content area
          },
        }}>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <span className="ml-5"> Loading companies data...</span>
          </div>
        ) : (
          <div>
            {/* Sticky Header */}
            <div
              style={{
                position: "sticky",
                top: "0",
                background: "#fff",
                zIndex: "1",
                padding: "10px",
              }}>
              <h3>All Companies</h3>
            </div>

            {/* Table */}
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Panel Name</th>
                    <th>Logo</th>
                    <th>Favicon</th>
                    <th>Login Image</th>
                  </tr>
                </thead>
                <tbody>
                  {companiesData.map((company, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{company.panelName}</td>
                      <td>
                        <img
                          src={company.logo}
                          alt="logo"
                          width="50"
                          height="50"
                        />
                      </td>
                      <td>
                        <img
                          src={company.favicon}
                          alt="favicon"
                          width="20"
                          height="20"
                        />
                      </td>
                      <td>
                        <img
                          src={company.loginImage}
                          alt="loginImage"
                          width="50"
                          height="50"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sticky Button */}
            <div
              style={{
                position: "sticky",
                bottom: "0",
                background: "#fff",
                zIndex: "1",
                padding: "10px",
              }}>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default System;
