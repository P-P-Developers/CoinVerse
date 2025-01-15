import Modal from "react-modal";
import Swal from "sweetalert2";
import {
  createOrUpdateCompanyApi,
  getCompanyApi,
} from "../../../Services/Superadmin/Superadmin";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import { useEffect, useState } from "react";

Modal.setAppElement("#root");

const System = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [companiesData, setCompaniesData] = useState({});

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    panelName: Yup.string()
      .required("Panel Name is required")
      .min(3, "Panel Name must be at least 3 characters"),
    logo: Yup.string().required("Logo is required"),
    favicon: Yup.string().required("Favicon is required"),
    loginImage: Yup.string().required("Login Image is required"),
  });

  const changeFavicon = (iconPath) => {
    const link =
      document.querySelector("favicon") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = iconPath;
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  // Fetch companies data from the API
  const fetchCompaniesData = async () => {
    try {
      const res = await getCompanyApi({});
      if (res.data) {
        setCompaniesData(res.data);
      }
    } catch (error) {
      console.log("Error fetching company data:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to load company data.",
      });
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchCompaniesData();
  }, []);

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
      console.log("Error during form submission:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while submitting the form. Please try again.",
      });
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-lg" style={{ marginTop: "50px" }}>
            <div className="card-header bg-primary text-white">
              <h4 className="text-center text-white mb-0">System Settings</h4>
            </div>
            {isLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "300px" }}>
                <ThreeDots
                  visible={true}
                  height="80"
                  width="80"
                  color="#4fa94d"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            ) : (
              <div className="card-body">
                <Formik
                  enableReinitialize={true} // Allows reinitialization of form values
                  initialValues={{
                    panelName: companiesData?.panelName || "",
                    logo: companiesData?.logo || "",
                    favicon: companiesData?.favicon || "",
                    loginImage: companiesData?.loginImage || "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}>
                  {({ setFieldValue, errors, touched, values }) => (
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
                            <div className="invalid-feedback">
                              {errors.logo}
                            </div>
                          )}
                          <small className="text-muted">
                            Choose a logo image from your gallery.
                          </small>
                          {values.logo && (
                            <div className="mt-2">
                              <img
                                src={values.logo}
                                alt="Current Logo"
                                width="100"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="row" style={{ marginTop: "-60px" }}>
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
                              changeFavicon(base64);
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
                          {/* {values.favicon && (
                            <div className="mt-2">
                              <img
                                src={values.favicon}
                                alt="Current Favicon"
                                width="50"
                              />
                            </div>
                          )} */}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 text-center">
                          <button
                            type="submit"
                            className="btn btn-primary w-100">
                            Save
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;
