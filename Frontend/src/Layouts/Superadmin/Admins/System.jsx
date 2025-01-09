// import React, { useEffect, useState } from "react";
// import Modal from "react-modal";
// import Swal from "sweetalert2";
// import {
//   createOrUpdateCompanyApi,
//   getCompanyApi,
// } from "../../../Services/Superadmin/Superadmin"; // Assuming this is your API call
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";

// Modal.setAppElement("#root");

// const System = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [companiesData, setCompaniesData] = useState([]);

//   // Validation schema using Yup
//   const validationSchema = Yup.object().shape({
//     panelName: Yup.string()
//       .required("Panel Name is required")
//       .min(3, "Panel Name must be at least 3 characters"),
//     logo: Yup.string().required("Logo is required"),
//     favicon: Yup.string().required("Favicon is required"),
//     loginImage: Yup.string().required("Login Image is required"),
//   });

//   console.log("companies : ", companiesData);

//   const convertToBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });

//   const handleSubmit = async (values) => {
//     try {
//       const res = await createOrUpdateCompanyApi(values);
//       if (res.status) {
//         Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text: res.message || "Company settings updated successfully!",
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text: res.message || "Something went wrong. Please try again.",
//         });
//       }
//     } catch (error) {
//       console.error("Error during form submission:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text: "An error occurred while submitting the form. Please try again.",
//       });
//     }
//   };

//   const fetchCompaniesData = async () => {
//     setIsLoading(true);
//     const res = await getCompanyApi({});
//     console.log("res is ", res);
//     setCompaniesData(res.data);
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchCompaniesData();
//   }, []);

//   // Set initial values once data is loaded
//   const initialValues = {
//     panelName: companiesData.panelName || "",
//     logo: companiesData.Logo || "",
//     favicon: companiesData.favicon || "",
//     loginImage: companiesData?.loginImage || "",
//   };

//   return (
//     <div className="container-fluid mt-4">
//       <div className="row justify-content-center">
//         <div className="col-12">
//           <div className="card shadow-lg" style={{ marginTop: "50px" }}>
//             <div className="card-header bg-primary text-white">
//               <h4 className="text-center text-white mb-0">System Settings</h4>
//             </div>
//             <div className="card-body">
//               {/* Key prop on Formik to re-render with new initialValues */}
//               <Formik
//                 key={companiesData.panelName} // key to reset form whenever data changes
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={handleSubmit}>
//                 {({ setFieldValue, errors, touched }) => (
//                   <Form>
//                     <div className="row">
//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="panelName" className="form-label">
//                           Panel Name
//                         </label>
//                         <Field
//                           type="text"
//                           name="panelName"
//                           id="panelName"
//                           className={`form-control ${
//                             errors.panelName && touched.panelName
//                               ? "is-invalid"
//                               : ""
//                           }`}
//                           placeholder="Enter Panel Name"
//                         />
//                         {errors.panelName && touched.panelName && (
//                           <div className="invalid-feedback">
//                             {errors.panelName}
//                           </div>
//                         )}
//                       </div>

//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="logo" className="form-label">
//                           Logo
//                         </label>
//                         <input
//                           type="file"
//                           id="logo"
//                           name="logo"
//                           className={`form-control ${
//                             errors.logo && touched.logo ? "is-invalid" : ""
//                           }`}
//                           onChange={async (e) => {
//                             const file = e.target.files[0];
//                             const base64 = await convertToBase64(file);
//                             setFieldValue("logo", base64);
//                           }}
//                         />
//                         {errors.logo && touched.logo && (
//                           <div className="invalid-feedback">{errors.logo}</div>
//                         )}
//                         <small className="text-muted">
//                           Choose a logo image from your gallery.
//                         </small>
//                       </div>
//                     </div>

//                     <div className="row">
//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="favicon" className="form-label">
//                           Favicon
//                         </label>
//                         <input
//                           type="file"
//                           id="favicon"
//                           name="favicon"
//                           className={`form-control ${
//                             errors.favicon && touched.favicon
//                               ? "is-invalid"
//                               : ""
//                           }`}
//                           onChange={async (e) => {
//                             const file = e.target.files[0];
//                             const base64 = await convertToBase64(file);
//                             setFieldValue("favicon", base64);
//                           }}
//                         />
//                         {errors.favicon && touched.favicon && (
//                           <div className="invalid-feedback">
//                             {errors.favicon}
//                           </div>
//                         )}
//                         <small className="text-muted">
//                           Upload a favicon file (16x16px).
//                         </small>
//                       </div>

//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="loginImage" className="form-label">
//                           Login Image
//                         </label>
//                         <input
//                           type="file"
//                           id="loginImage"
//                           name="loginImage"
//                           className={`form-control ${
//                             errors.loginImage && touched.loginImage
//                               ? "is-invalid"
//                               : ""
//                           }`}
//                           onChange={async (e) => {
//                             const file = e.target.files[0];
//                             const base64 = await convertToBase64(file);
//                             setFieldValue("loginImage", base64);
//                           }}
//                         />
//                         {errors.loginImage && touched.loginImage && (
//                           <div className="invalid-feedback">
//                             {errors.loginImage}
//                           </div>
//                         )}
//                         <small className="text-muted">
//                           Upload a background image for the login page.
//                         </small>
//                       </div>
//                     </div>

//                     <div className="row">
//                       <div className="col-12 text-center">
//                         <button type="submit" className="btn btn-primary w-100">
//                           Save
//                         </button>
//                       </div>
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default System;



import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import {
  createOrUpdateCompanyApi,
  getCompanyApi,
} from "../../../Services/Superadmin/Superadmin"; // Assuming this is your API call
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";


Modal.setAppElement("#root");

const System = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Fetch companies data from the API
  const fetchCompaniesData = async () => {
    try {
      const res = await getCompanyApi({});
      if (res.data) {
        setCompaniesData(res.data);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
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

  // Initial form values based on companiesData
  const initialValues = {
      panelName: companiesData?.panelName || "",
      logo: companiesData?.Logo || "",
      favicon: companiesData?.favicon || "",
      loginImage: companiesData?.loginImage || "",
    }

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
                            <div className="invalid-feedback">
                              {errors.logo}
                            </div>
                          )}
                          <small className="text-muted">
                            Choose a logo image from your gallery.
                          </small>
                          {initialValues?.logo && (
                            <div className="mt-2">
                              <img
                                src={initialValues?.logo}
                                alt="Current Logo"
                                width="100"
                              />
                            </div>
                          )}
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
                          {initialValues?.favicon && (
                            <div className="mt-2">
                              <img
                                src={initialValues?.favicon}
                                alt="Current Favicon"
                                width="50"
                              />
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 mb-3">
                          {/* <label htmlFor="loginImage" className="form-label">
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
                          {initialValues.loginImage && (
                            <div className="mt-2">
                              <img
                                src={initialValues.loginImage}
                                alt="Current Login Image"
                                width="100"
                              />
                            </div>
                          )}*/}
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
