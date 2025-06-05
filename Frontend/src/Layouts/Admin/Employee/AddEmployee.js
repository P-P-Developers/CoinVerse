import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik";
import { AddnewUsers } from "../../../Services/Superadmin/Superadmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const AddEmployee = () => {
  const TokenData = getUserFromToken();
  const navigate = useNavigate();
  const Role = TokenData?.Role;
  const user_id = TokenData?.user_id;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",

      password: "",
      confirmPassword: "",
      parent_id: "",
      parent_role: "",
      Role: "",
      all: false,
      addclient: false,
      Edit: false,
      trade_history: false,
      open_position: false,
      limit_edit: false,
      Balance_edit: false,
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
   
      if (!values.password) {
        errors.password = "Please Enter Password";
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please Confirm Password";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        
        password: values.password,
        parent_role: Role || "ADMIN",
        parent_id: user_id,
        Role: "EMPLOYE",
        Employee_permission: {
          client_add: values.addclient || values.all ? "1" : "0",
          Edit: values.Edit || values.all ? "1" : "0",
          trade_history: values.trade_history || values.all ? "1" : "0",
          open_position: values.open_position || values.all ? "1" : "0",
     
          limit_edit: values.limit_edit || values.all ? "1" : "0",
          Balance_edit: values.Balance_edit || values.all ? "1" : "0",
        },
      };

      setSubmitting(false);

      await AddnewUsers(data)
        .then((response) => {
          if (response.status) {
            Swal.fire({
              title: "Employe Added!",
              text: "Employe added successfully",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
            });
            setTimeout(() => {
              navigate("/admin/employee");
            }, 1000);
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message || "Employe add error",
              icon: "error",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        })
        .catch((error) => {});
    },
    onChange: (e) => {
      const { name, checked } = e.target;
      formik.setFieldValue(name, checked);
      if (name === "all") {
        formik.setFieldValue("addclient", checked);
        formik.setFieldValue("Edit", checked);
        formik.setFieldValue("trade_history", checked);
        formik.setFieldValue("open_position", checked);

        formik.setFieldValue("limit_edit", checked);
        formik.setFieldValue("Balance_edit", checked);
      }
    },
  });

  useEffect(() => {
    const {
      addclient,
      Edit,
      trade_history,
      open_position,
     
      limit_edit,
      Balance_edit,
    } = formik.values;

    const allSelected =
      addclient &&
      Edit &&
      trade_history &&
      open_position &&

      limit_edit &&
      Balance_edit;

    if (formik.values.all == allSelected) {
      formik.setFieldValue("all", allSelected);
    }
  }, [
    formik.values.addclient,
    formik.values.Edit,
    formik.values.trade_history,
    formik.values.open_position,
   
    formik.values.limit_edit,
    formik.values.Balance_edit,
    formik.values.all,
  ]);

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
      name: "password",
      label: "Password",
      type: "password",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "permissionsHeading",
      label: "Permissions",
      type: "heading",
      label_size: 12,
      col_size: 12,
      disable: true,
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
      check_box_true: formik.values.all || formik.values.Edit ? true : false,
    },
    {
      name: "trade_history",
      label: "Trade History",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.trade_history ? true : false,
    },
    {
      name: "open_position",
      label: "Open Position",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.open_position ? true : false,
    },
  
    {
      name: "limit_edit",
      label: "Limit Edit",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.limit_edit ? true : false,
    },
    {
      name: "Balance_edit",
      label: "Balance Edit",
      type: "checkbox",
      label_size: 12,
      col_size: 3,
      check_box_true:
        formik.values.all || formik.values.Balance_edit ? true : false,
    },
  ];

  return (
    <Form
      fields={fields.filter(
        (field) => !field.showWhen || field.showWhen(formik.values)
      )}
      page_title="Add Employee"
      btn_name="Add Employee"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route={"/admin/employee"}
    />
  );
};

export default AddEmployee;
