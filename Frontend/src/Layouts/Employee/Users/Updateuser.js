import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik"; // Assuming this is your custom Form component
import { updateuserdata } from "../../../Services/Admin/Addmin";

const Updateuser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rowData } = location.state;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      employee_id: "",
   
      limit: "",
      selectedOption: "",
      inputValue: "",
    },
    validate: (values) => {
      let errors = {};

      // Full Name validation
      if (!values.fullName) {
        errors.fullName = "Please Enter Full Name";
      }

      // Username validation
      if (!values.username) {
        errors.username = "Please Enter Username";
      }

      // Email validation
      if (!values.email) {
        errors.email = "Please Enter Email Address";
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Please enter a valid email address.";
      }

      // Phone validation
      if (!values.phone) {
        errors.phone = "Please Enter Phone Number";
      } else if (!/^\d{10}$/.test(values.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number.";
      }

     
      // Limit validation
      if (!values.limit) {
        errors.limit = "Please enter a value for Limit";
      } else if (
        isNaN(values.limit) ||
        values.limit < 0 ||
        values.limit > 100
      ) {
        errors.limit = "Limit must be a number between 0 and 100.";
      }

      // Selected option validation
      if (!values.selectedOption) {
        errors.selectedOption = "Please select an option";
      }

      // Input value validation
      if (!values.inputValue) {
        errors.inputValue = "Please enter a value for the selected option";
      }

      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
  

      if (values.limit < 0 || values.limit > 100) {
        Swal.fire({
          title: "Invalid Input",
          text: "Limit must be a number between 0 and 100.",
          icon: "warning",
          timer: 2000,
          timerProgressBar: true,
        });
        setSubmitting(false);
        return;
      }

      const data = {
        id: rowData && rowData._id,
        limit: values.limit,
        [values.selectedOption]: values.inputValue,
      };

      try {
        const response = await updateuserdata(data);

        if (response && response.status) {
          Swal.fire({
            title: "User Updated!",
            text: "User updated successfully",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => navigate("/admin/users"), 2000);
        } else {
          Swal.fire({
            title: "Update Failed",
            text: response?.message || "Unknown error occurred.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to update user. Please try again later.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (rowData) {
      const determineSelectedOption = () => {
        if (rowData.pertrade && rowData.pertrade !== 0) {
          return "pertrade";
        } else if (rowData.perlot && rowData.perlot !== 0) {
          return "perlot";
        }
        return "pertrade";
      };

      formik.setValues({
        fullName: rowData.FullName || "",
        username: rowData.UserName || "",
        email: rowData.Email || "",
        phone: rowData.PhoneNo || "",
        selectedOption: rowData.selectedOption || determineSelectedOption(),
        inputValue: rowData.pertrade || rowData.perlot || "",
        limit: rowData.limit || "",
      });
    }
  }, [rowData]);

  const getInputValueLabel = (selectedOption) => {
    if (selectedOption === "pertrade") return "Enter Value for Per Trade";
    if (selectedOption === "perlot") return "Enter Value for Per Lot";
    return "Enter Value";
  };

  // Form fields configuration
  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: true,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: true,
    },

   
    {
      name: "limit",
      label: "Margin",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      name: "selectedOption",
      label: "Select One Option",
      type: "select",
      options: [
        { value: "pertrade", label: "Per Trade" },
        { value: "perlot", label: "Per Lot" },
      ],
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "inputValue",
      label: getInputValueLabel(formik.values.selectedOption),
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => !!values.selectedOption,
    },
  ];

  return (
    <Form
      fields={fields}
      page_title="Update User"
      btn_name="Update User"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route={"/employee/users"}
    />
  );
};

export default Updateuser;
