import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Form from "../../../Utils/Form/Formik";
import { Update_Employe } from "../../../Services/Admin/Addmin";



const UpdateEmploye = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rowData } = location.state;

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const Role = userDetails?.Role;
  const user_id = userDetails?.user_id;



  
  const formik = useFormik({
    initialValues: {
      fullName: rowData?.FullName || "",
      username: rowData?.UserName || "",
      email: rowData?.Email || "",
      phone: rowData?.PhoneNo || "",
      // Balance: rowData?.Balance || "",
      // password: "",
      // confirmPassword: "",
      all: false,
      addclient: false,
      Edit:false,
      trade_history:false,
      open_position:false,
      Licence_Edit:false,
      limit_edit:false,
      Balance_edit:false,
    },
    
    validate: (values) => {
      let errors = {};
      if (!values.fullName) {
        errors.fullName = "Please Enter Full Name";
      }
      if (!values.username) {
        errors.username = "Please Enter Username";
      }
      if (!values.email) {
        errors.email = "Please Enter Email Address";
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Please enter a valid email address.";
      }
      if (!values.phone) {
        errors.phone = "Please Enter Phone Number";
      } else if (!/^\d{10}$/.test(values.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number.";
      }
      // if (!values.Balance) {
      //   errors.Balance = "Please Enter Balance";
      // }
      // Add password validation if necessary
      // if (!values.password) {
      //   errors.password = "Please Enter Password";
      // } else if (values.password !== values.confirmPassword) {
      //   errors.confirmPassword = "Passwords do not match";
      // }

      return errors;
    },
    
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        id: rowData?._id,
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        // Balance: values.Balance,
      //  Password: values.password,
       Employee_permission: {
        client_add: values.addclient || values.all ? "1" : "0",
        Edit: values.Edit || values.all ? "1" : "0",
        trade_history: values.trade_history || values.all ? "1" : "0",
        open_position: values.open_position || values.all ? "1" : "0",
        Licence_Edit: values.Licence_Edit || values.all ? "1" : "0",
        limit_edit: values.limit_edit || values.all ? "1" : "0",
        Balance_edit: values.Balance_edit || values.all ? "1" : "0",
      },
      };

      setSubmitting(false);

      try {
        const response = await Update_Employe(data);
        if (response.status) {
          Swal.fire({
            title: "Employee Updated!",
            text: "Employee updated successfully",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/admin/employee");
          }, 1500);
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message || "Employee update error",
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.log("Error:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update employee",
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
        formik.setFieldValue("addclient", checked);
        formik.setFieldValue("Edit", checked);
        formik.setFieldValue("trade_history", checked);
        formik.setFieldValue("open_position", checked);
        formik.setFieldValue("Licence_Edit", checked);
        formik.setFieldValue("limit_edit", checked);
        formik.setFieldValue("Balance_edit", checked);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      fullName: rowData?.FullName || "",
      username: rowData?.UserName || "",
      email: rowData?.Email || "",
      phone: rowData?.PhoneNo || "",
      // Balance: rowData?.Balance || "",
      // password: "",
      Password: rowData?.Otp || "",
      addclient:rowData.permissions[0]?.client_add == 1 ? true : false,
      Edit:rowData.permissions[0]?.Edit == 1 ? true : false,
      trade_history:rowData.permissions[0]?.trade_history == 1 ? true : false,
      open_position:rowData.permissions[0]?.open_position == 1 ? true : false,
      Licence_Edit:rowData.permissions[0]?.Licence_Edit == 1 ? true : false,
      limit_edit:rowData.permissions[0]?.limit_edit == 1 ? true : false,
      Balance_edit:rowData.permissions[0]?.Balance_edit == 1 ? true : false,

    });
  }, [rowData]);



  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },

    {
      name: "Password",
      label: "Password",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
    },

 
   
    {
      name: "all",
      label: "Select All",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
      check_box_true: formik.values.all,
    },
    {
      name: "addclient",
      label: "Add Client",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.addclient ? true : false,
    },
    {
      name: "Edit",
      label: "Edit",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.Edit ? true : false,
    },
    {
      name: "trade_history",
      label: "trade_history",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true: formik.values.all || formik.values.trade_history ? true : false,
    },
    {
      name: "open_position",
      label: "open_position",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.open_position ? true : false,
    },
    {
      name: "Licence_Edit",
      label: "Licence_Edit",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.Licence_Edit ? true : false,
    },
    {
      name: "limit_edit",
      label: "limit_edit",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.limit_edit ? true : false,
    },
    {
      name: "Balance_edit",
      label: "Balance_edit",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.Balance_edit ? true : false,
    },
  ];

  return (
    <Form
      fields={fields}
      page_title="Update Employee"
      btn_name="Update Employee"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route={"/admin/employee"}
    />
  );
};

export default UpdateEmploye;
