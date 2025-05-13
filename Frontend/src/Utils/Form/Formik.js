import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoveLeft, Plus } from "lucide-react";

const DynamicForm = ({
  fields,
  page_title,

  btn_name1,
  btn_name1_route,
  formik,
  btn_name,
  title,
  additional_field,
  btn_status,
  content_btn_name,
  content_path,
  btn_name2,
}) => {

  const [passwordVisible, setPasswordVisible] = useState({});

  return (
    <div className="content container-fluid" data-aos="fade-left">
      <div className="card mb-0">
        {page_title ? (
          <div className="card-header">
            {page_title ? (
              <h5 className="card-title mb-0 w-auto">
                <i className="fa-regular fa-circle-user pe-2"></i>
                {page_title}{" "}
              </h5>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="card-body ">
            <div className="page-header">
              <div className="content-page-header d-flex justify-content-between align-items-center">
                {btn_status == "true" ? (
                  content_btn_name == "Back" ? (
                    <Link to={content_path} className="btn btn-primary">
                      {" "}
                      <MoveLeft /> {content_btn_name}{" "}
                    </Link>
                  ) : (
                    <Link to={content_path} className="btn btn-primary">
                      {" "}
                      <Plus /> {content_btn_name}{" "}
                    </Link>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>

            <div>
              <div>
                {/*  form  */}
                <div className="row d-flex ">
                  {fields.map((field, index) => (
                    <React.Fragment key={index}>
                      {field.type === "heading" ? (
                        <div className={`col-lg-${field.col_size}`}>
                          <div className="input-block mb-1">
                            <label
                              className={`col-form-label col-lg-${field.label_size} fw-bold fs-5`}
                            >
                              {field.label}
                            </label>
                          </div>
                        </div>
                      ) : field.type === "text" ? (
                        <>
                          <div className={` col-lg-${field.col_size}`}>
                            <div className="input-block mb-3 flex-column">
                              <label className={`col-lg-${field.label_size}`}>
                                {field.label}
                                <span className="text-danger">*</span>
                              </label>

                              <input
                                type="text"
                                autoComplete="new-email1"
                                aria-describedby="basic-addon1"
                                className="form-control"
                                placeholder={`Enter ${field.label}`}
                                readOnly={field.disable}
                                id={field.name}
                                name={field.name}
                                {...formik.getFieldProps(field.name)}
                              />
                              {formik.touched[field.name] &&
                              formik.errors[field.name] ? (
                                <div style={{ color: "red" }}>
                                  {formik.errors[field.name]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : field.type === "text1" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="input-block mb-3 flex-column">
                              <label className={`col-lg-${field.label_size}`}>
                                {field.label}
                                <span className="text-danger">*</span>
                              </label>

                              <input
                                type="text"
                                autoComplete="new-email1"
                                aria-describedby="basic-addon1"
                                className="form-control"
                                placeholder={`Enter ${field.label}`}
                                readOnly={field.disable}
                                id={field.name}
                                name={field.name}
                                value={formik.values[field.name]}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, ""); // allow only numbers
                                  if (Number(value) > 10000) {
                                    value = "10000"; // cap value
                                  }
                                  formik.setFieldValue(field.name, value);
                                }}
                                onBlur={formik.handleBlur}
                              />

                              {formik.touched[field.name] &&
                              formik.errors[field.name] ? (
                                <div style={{ color: "red" }}>
                                  {formik.errors[field.name]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : field.type === "percentage" ? (
                        <div className={`col-lg-${field.col_size}`}>
                          <div className="input-block mb-3 flex-column">
                            <label className={`col-lg-${field.label_size}`}>
                              {field.label}
                              <span className="text-danger">*</span>
                            </label>

                            <input
                              type="number"
                              min={1}
                              max={100}
                              autoComplete="off"
                              aria-describedby="basic-addon1"
                              className="form-control"
                              placeholder={`Enter ${field.label} (1–100)`}
                              readOnly={field.disable}
                              id={field.name}
                              name={field.name}
                              {...formik.getFieldProps(field.name)}
                              onInput={(e) => {
                                const val = Math.max(
                                  1,
                                  Math.min(100, Number(e.target.value))
                                );
                                e.target.value = val;
                                formik.setFieldValue(field.name, val);
                              }}
                            />

                            {formik.touched[field.name] &&
                            formik.errors[field.name] ? (
                              <div style={{ color: "red" }}>
                                {formik.errors[field.name]}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : field.type === "select" ? (
                        <>
                          <div
                            className={`col-lg-${
                              title === "update_theme" ? 12 : 6
                            }`}
                          >
                            <div className="input-block row mb-3">
                              <label
                                className={`col-lg-${
                                  title === "forlogin"
                                    ? 3
                                    : title === "update_theme"
                                    ? 12
                                    : 7
                                }  col-form-label p-0 mx-3 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                <span className="text-danger">*</span>
                              </label>
                              <div
                                className={`col-lg-${
                                  title === "addgroup" ? 12 : 12
                                }`}
                              >
                                <select
                                  className="default-select wide form-control"
                                  aria-describedby="basic-addon1"
                                  disabled={field.disable}
                                  id={field.name}
                                  {...formik.getFieldProps(field.name)}
                                >
                                  <option value="" selected>
                                    Select {field.label}
                                  </option>
                                  {field.options.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>

                                {formik.touched[field.name] &&
                                formik.errors[field.name] ? (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "checkbox" ? (
                        <div className={`col-lg-${field.col_size}`}>
                          <div className="row d-flex justify-content-start">
                            <div className="mb-4">
                              <div className="form-check custom-checkbox">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={field.label}
                                  checked={formik.values[field.name]} // Bind the checkbox state to Formik's value
                                  disabled={field.disable}
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      field.name,
                                      e.target.checked
                                    ); // Update Formik's state
                                    if (field.onChange) {
                                      field.onChange(e); // Call the custom onChange handler if provided
                                    }
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={field.label}
                                >
                                  {field.label}
                                </label>
                              </div>
                              {formik.errors[field.name] && (
                                <div style={{ color: "red" }}>
                                  {formik.errors[field.name]}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : field.type === "password" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className=" input-block row">
                              <label
                                className={`col-lg-${field.label_size} col-form-labelp-0 `}
                                htmlFor={field.name}
                              >
                                {field.label}
                                <span className="text-danger">*</span>
                              </label>
                              <div
                                // className={`col-lg-${field.col_size}`}
                                style={{ position: "relative" }}
                              >
                                <input
                                  id={field.name}
                                  autoComplete="new-password"
                                  type={
                                    passwordVisible[field.name]
                                      ? "text"
                                      : field.type
                                  }
                                  placeholder={`Enter ${field.label}`}
                                  {...formik.getFieldProps(field.name)}
                                  className={` form-control`}
                                />
                                <i
                                  className={`fa-solid ${
                                    passwordVisible[field.name]
                                      ? "fa-eye-slash"
                                      : "fa-eye"
                                  }`}
                                  style={{
                                    position: "absolute",
                                    top: "1.5px",
                                    right: "20px",
                                    padding: "12.4px 6.6px",
                                    borderRadius: "3px",
                                  }}
                                  onClick={() =>
                                    setPasswordVisible((prevState) => ({
                                      ...prevState,
                                      [field.name]: !prevState[field.name],
                                    }))
                                  }
                                ></i>
                                {formik.touched[field.name] &&
                                formik.errors[field.name] ? (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "date" ? (
                        <>
                          <div className="col-lg-3">
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-check custom-checkbox input-block  mb-3">
                                  <label className="col-lg-6 " for={field.name}>
                                    {field.name}
                                  </label>
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    className="form-control"
                                    id={field.name}
                                    {...formik.getFieldProps(field.name)}
                                  />
                                </div>
                                {formik.errors[field.name] && (
                                  <div style={{ color: "red" }}>
                                    {formik.errors[field.name]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "number" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-group input-block mb-3">
                                  <label htmlFor={field.name}>
                                    {field.label}
                                  </label>

                                  <input
                                    type="number"
                                    name={field.name}
                                    aria-describedby="basic-addon1"
                                    className="form-control"
                                    id={field.name}
                                    placeholder={`Enter ${field.label}`}
                                    {...formik.getFieldProps(field.name)}
                                  />

                                  {formik.touched[field.name] &&
                                  formik.errors[field.name] ? (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "text3" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-group input-block mb-3">
                                  <label htmlFor={field.name}>
                                    {field.label}
                                  </label>
                                  <span className="text-danger">*</span>
                                  <input
                                    type="text"
                                    name={field.name}
                                    readOnly={field.disable}
                                    aria-describedby="basic-addon1"
                                    className="form-control"
                                    id={field.name}
                                    placeholder={`Enter ${field.label}`}
                                    {...formik.getFieldProps(field.name)}
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      const newValue = value
                                        .replace(/\D/g, "")
                                        .slice(0, 10);
                                      e.target.value = newValue;
                                      formik.handleChange(e);
                                    }}
                                  />

                                  {formik.touched[field.name] &&
                                  formik.errors[field.name] ? (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : field.type === "text4" ? (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div className="form-group input-block mb-3">
                                  <label htmlFor={field.name}>
                                    {field.label}
                                  </label>
                                  <span className="text-danger">*</span>
                                  <input
                                    type="number"
                                    name={field.name}
                                    readOnly={field.disable}
                                    aria-describedby="basic-addon1"
                                    className="form-control"
                                    id={field.name}
                                    placeholder={`Enter ${field.label}`}
                                    {...formik.getFieldProps(field.name)}
                                    min={1}
                                    onChange={(e) => {
                                      let value = e.target.value;
                                      // Remove any leading zeros
                                      value = value.replace(/^0+/, "");
                                      // If value is empty, set it to 0
                                      if (value === "") {
                                        value = "";
                                      }
                                      // Enforce maximum value of 100
                                      value = Math.min(parseInt(value), 100);
                                      // Update input value
                                      e.target.value = value;
                                      formik.handleChange(e);
                                    }}
                                  />

                                  {formik.touched[field.name] &&
                                  formik.errors[field.name] ? (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="input-block mb-3"></div>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                  {additional_field}

                  <div className="add-customer-btns text-end mt-3 ">
                    {btn_name1 ? (
                      <Link
                        to={btn_name1_route}
                        className="btn customer-btn-cancel btn btn-primary"
                      >
                        {btn_name1}
                      </Link>
                    ) : (
                      ""
                    )}
                    {
                      <>
                        <button
                          type="submit"
                          className="btn customer-btn-save btn btn-primary m-2"
                        >
                          {btn_name}
                        </button>
                        {btn_name2 ? (
                          <button
                            type="submit"
                            className="btn customer-btn-save btn btn-primary"
                          >
                            {btn_name2}
                          </button>
                        ) : (
                          ""
                        )}
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
