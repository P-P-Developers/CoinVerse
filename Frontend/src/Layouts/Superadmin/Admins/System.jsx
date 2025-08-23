import Modal from "react-modal";
import Swal from "sweetalert2";
import {
  createOrUpdateCompanyApi,
  getCompanyApi,
  removeCompanyImagedata
} from "../../../Services/Superadmin/Superadmin";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { X } from 'lucide-react';

Modal.setAppElement("#root");

const System = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [companiesData, setCompaniesData] = useState({});

  const validationSchema = Yup.object().shape({
    panelName: Yup.string()
      .required("Panel Name is required")
      .min(3, "Panel Name must be at least 3 characters"),
    loginUrl: Yup.string()
      .required("Login URL is required")
      .url("Enter a valid URL"),
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

  const fetchCompaniesData = async () => {
    try {
      const res = await getCompanyApi({});
      if (res.data) {
        setCompaniesData(res.data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to load company data.",
      });
    } finally {
      setIsLoading(false);
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
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while submitting the form. Please try again.",
      });
    }
  };

  const RemoveImage = async (type) => {
    try {
      const data = { type: type }
      const res = await removeCompanyImagedata(data);
      if (res.status) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.message || "Image is Removed !",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
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
                  enableReinitialize={true}
                  initialValues={{
                    panelName: companiesData?.panelName || "",
                    loginUrl: companiesData?.loginUrl || "",
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
                            className={`form-control ${errors.panelName && touched.panelName
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
                          <label htmlFor="loginUrl" className="form-label">
                            Login URL
                          </label>
                          <Field
                            type="text"
                            name="loginUrl"
                            id="loginUrl"
                            className={`form-control ${errors.loginUrl && touched.loginUrl
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Enter Login URL"
                          />
                          {errors.loginUrl && touched.loginUrl && (
                            <div className="invalid-feedback">
                              {errors.loginUrl}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="logo" className="form-label">
                            Logo
                          </label>
                          <input
                            type="file"
                            id="logo"
                            name="logo"
                            className={`form-control ${errors.logo && touched.logo ? "is-invalid" : ""
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

                          {values.logo && (
                            <div className="mt-2 position-relative d-inline-block">
                              {/* Image */}
                              <img
                                src={values.logo}
                                alt="Current Logo"
                                width="100"
                                className="rounded border"
                              />


                              <button
                                type="button"
                                className="position-absolute btn btn-danger rounded-circle p-1"
                                style={{
                                  top: '-8px',
                                  right: '-8px',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '2px solid white',
                                  fontSize: '12px'
                                }}
                                onClick={() => RemoveImage(1)}
                                title="Remove Logo"
                              >
                                <X size={12} color="white" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="col-md-4 mb-3">
                          <label htmlFor="favicon" className="form-label">
                            Favicon
                          </label>
                          <input
                            type="file"
                            id="favicon"
                            name="favicon"
                            className={`form-control ${errors.favicon && touched.favicon
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

                          {values.favicon && (
                            <div className="mt-2 position-relative d-inline-block">
                              {/* Image */}
                              <img
                                src={values.favicon}
                                alt="Current Favicon"
                                width="100"
                                className="rounded border"
                              />

                              {/* Red Cross icon - top right corner */}
                              <button
                                type="button"
                                className="position-absolute btn btn-danger rounded-circle p-1"
                                style={{
                                  top: '-8px',
                                  right: '-8px',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '2px solid white',
                                  fontSize: '12px'
                                }}
                                onClick={() => RemoveImage(2)}
                                title="Remove Favicon"
                              >
                                <X size={12} color="white" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="loginImage" className="form-label">
                            Login Image
                          </label>
                          <input
                            type="file"
                            id="loginImage"
                            name="loginImage"
                            className={`form-control ${errors.loginImage && touched.loginImage
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

                          {values.loginImage && (
                            <div className="mt-2 position-relative d-inline-block">
                              {/* Image */}
                              <img
                                src={values.loginImage}
                                alt="Current Login Image"
                                width="100"
                                className="rounded border"
                              />


                              <button
                                type="button"
                                className="position-absolute btn btn-danger rounded-circle p-1"
                                style={{
                                  top: '-8px',
                                  right: '-8px',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '2px solid white',
                                  fontSize: '12px'
                                }}
                                onClick={() => RemoveImage(3)}
                                title="Remove Login Image"
                              >
                                <X size={12} color="white" />
                              </button>
                            </div>
                          )}
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