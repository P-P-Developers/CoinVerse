import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik";
import { Update_Employe } from "../../../Services/Admin/Addmin";
import { getEmployee_permissiondata } from "../../../Services/Employee/Employee";

const UpdateEmploye = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rowData } = location.state || {};

  useEffect(() => {
    if (!rowData) {
      Swal.fire({
        title: "Error",
        text: "Employee data not found.",
        icon: "error",
      }).then(() => navigate("/admin/employee"));
    }
  }, [rowData, navigate]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      all: false,
      addclient: false,
      Edit: false,
      trade_history: false,
      open_position: false,

      limit_edit: false,
      Balance_edit: false,
    },

    validate: (values) => {
      const errors = {};
      if (!values.fullName) errors.fullName = "Please enter full name.";
      if (!values.username) errors.username = "Please enter username.";
      if (!values.email) {
        errors.email = "Please enter email.";
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Invalid email format.";
      }
      if (!values.phone) {
        errors.phone = "Please enter phone number.";
      } else if (!/^\d{10}$/.test(values.phone)) {
        errors.phone = "Phone number must be 10 digits.";
      }
      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        id: rowData?._id,
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        Employee_permission: {
          client_add: values.addclient || values.all ? "1" : "0",
          Edit: values.Edit || values.all ? "1" : "0",
          trade_history: values.trade_history || values.all ? "1" : "0",
          open_position: values.open_position || values.all ? "1" : "0",

          limit_edit: values.limit_edit || values.all ? "1" : "0",
          Balance_edit: values.Balance_edit || values.all ? "1" : "0",
        },
      };

      try {
        const response = await Update_Employe(data);
        setSubmitting(false);
        if (response?.status) {
          Swal.fire({
            title: "Success!",
            text: "Employee updated successfully.",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => navigate("/admin/employee"), 1500);
        } else {
          Swal.fire({
            title: "Failed!",
            text: response?.message || "Update failed.",
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
          });
        }
      } catch (error) {

        setSubmitting(false);
        Swal.fire({
          title: "Server Error",
          text: "Something went wrong while updating.",
          icon: "error",
          timer: 1500,
          timerProgressBar: true,
        });
      }
    },

    onChange: (e) => {
      const { name, checked } = e.target;
      formik.setFieldValue(name, checked);
      if (name === "all") {
        [
          "addclient",
          "Edit",
          "trade_history",
          "open_position",

          "limit_edit",
          "Balance_edit",
        ].forEach((field) => formik.setFieldValue(field, checked));
      }
    },
  });

  useEffect(() => {
    if (rowData) {
      const loadInitialValues = async () => {
        try {
          const data = { id: rowData._id };
          const response = await getEmployee_permissiondata(data);
          const permissions =
            response?.data?.[0] || rowData?.permissions?.[0] || {};

          const allChecked = Object.values(permissions).every(
            (val) => val === "1"
          );

          formik.setValues({
            fullName: rowData.FullName || "",
            username: rowData.UserName || "",
            email: rowData.Email || "",
            phone: rowData.PhoneNo || "",
            Password: rowData.Otp || "",
            addclient: permissions.client_add === 1,
            Edit: permissions.Edit === 1,
            trade_history: permissions.trade_history === 1,
            open_position: permissions.open_position === 1,

            limit_edit: permissions.limit_edit === 1,
            Balance_edit: permissions.Balance_edit === 1,
            all: allChecked,
          });
        } catch (error) {

          Swal.fire({
            title: "Error",
            text: "Failed to load employee permissions.",
            icon: "error",
          });
        }
      };

      loadInitialValues();
    }
  }, [rowData]);

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", col_size: 6 },
    { name: "username", label: "Username", type: "text", col_size: 6 },
    { name: "email", label: "Email", type: "text", col_size: 6 },
    { name: "phone", label: "Phone Number", type: "text3", col_size: 6 },
    {
      name: "Password",
      label: "Password",
      type: "text",
      col_size: 6,
      disable: true,
    },

    {
      name: "addclient",
      label: "Add Client",
      type: "checkbox",
      col_size: 3,
      check_box_true: formik.values.all || formik.values.addclient,
    },
    {
      name: "Edit",
      label: "Edit",
      type: "checkbox",
      col_size: 3,
      check_box_true: formik.values.all || formik.values.Edit,
    },
    {
      name: "trade_history",
      label: "Trade History",
      type: "checkbox",
      col_size: 3,
      check_box_true: formik.values.all || formik.values.trade_history,
    },
    {
      name: "open_position",
      label: "Available Position",
      type: "checkbox",
      col_size: 3,
      check_box_true: formik.values.all || formik.values.open_position,
    },

    {
      name: "limit_edit",
      label: "Limit Edit",
      type: "checkbox",
      col_size: 3,
      check_box_true: formik.values.all || formik.values.limit_edit,
    },
    // {
    //   name: "Balance_edit",
    //   label: "Balance Edit",
    //   type: "checkbox",
    //   col_size: 3,
    //   check_box_true: formik.values.all || formik.values.Balance_edit,
    // },
  ];

  return (
    <Form
      fields={fields}
      page_title="Update Employee"
      btn_name="Update Employee"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route="/admin/employee"
    />
  );
};

export default UpdateEmploye;
