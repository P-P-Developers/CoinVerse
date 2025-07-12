import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik"; // Assuming this is your custom Form component
import { updateuserdata } from "../../../Services/Admin/Addmin";
import { getUserdata } from "../../../Services/Superadmin/Superadmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Updateuser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const TokenData = getUserFromToken();

  const { rowData } = location.state;
  const [data, setData] = useState([]);
  const user_id = TokenData?.user_id;

  useEffect(() => {
    getAlluserdata();
  }, []);



  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      employee_id: "",

      limit: "1",
      holding_limit: "1",
      selectedOption: "",
      inputValue: "",
    },
    validate: (values) => {
      let errors = {};
      // Validation rules for form fields
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
    

      if (!values.limit) {
        errors.limit = "Please enter a value for Limit";
      } else if (
        isNaN(values.limit) ||
        values.limit < 0 ||
        values.limit > 10000
      ) {
        errors.limit = "Limit must be a number between 0 and 10000.";
      }


        if (!values.holding_limit) {
        errors.holding_limit = "Please enter a value for HOLDING limit";
      } else if (
        isNaN(values.holding_limit) ||
        values.holding_limit < 0 ||
        values.holding_limit > 10000
      ) {
        errors.holding_limit = "HOLDING limit must be a number between 0 and 10000.";
      }


      if (!values.selectedOption) {
        errors.selectedOption = "Please select an option";
      }
      if (!values.inputValue) {
        errors.inputValue = "Please enter a value for the selected option";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const selectedOption = values.selectedOption;
      const data = {
        id: rowData && rowData._id,
        limit: values.limit,
        holding_limit: values.holding_limit || "1",
        employee_id: values.employee_id,

        [selectedOption]: values.inputValue,
      };
      setSubmitting(false);
      try {
        const response = await updateuserdata(data);
        if (response.status) {
          Swal.fire({
            title: "User Updated!",
            text: "User updated successfully",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/admin/users");
          }, 2000);
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message || "User update error",
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
        return "transactionwise"; // Default to "pertrade" if both are null, undefined, or 0.
      };

      formik.setValues({
        fullName: rowData.FullName || "",
        username: rowData.UserName || "",
        email: rowData.Email || "",
        phone: rowData.PhoneNo || "",
        Password: rowData.Otp || "",
        employee_id: rowData.employee_id || "",

        selectedOption: determineSelectedOption(),
        inputValue:
          rowData.pertrade || rowData.perlot || rowData.transactionwise || "",
        limit: rowData.limit || "1",
        holding_limit: rowData.holding_limit || "1",
      });
    }
  }, [rowData]);

  const getInputValueLabel = (selectedOption) => {
    if (selectedOption === "pertrade") return "Enter Value for Per Trade";
    if (selectedOption === "perlot") return "Enter Value for Per Lot";
    return "Enter Value";
  };

  const getAlluserdata = async () => {
    const data = { id: user_id };
    try {
      const response = await getUserdata(data);
      const result =
        response.data &&
        response.data.filter((item) => {
          return item.Role === "EMPLOYE";
        });
      setData(result);
    } catch (error) { }
  };

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
      name: "Password",
      label: "Password",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
    },

    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      options: [
        { label: "Admin", value: "Admin" },
        ...(data
          ? data.map((item) => ({
            label: item.UserName,
            value: item._id,
          }))
          : []),
      ],
      label_size: 12,
      col_size: 6,
      disable: false,
    },

   


   {
      name: "holding_limit",
      label: "HOLDING Margin",
      type: "percentage",
      label_size: 12,
      col_size: 6,
      disable: false,
      min: 0,
      max: 12,
    },
    {
      name: "limit",
      label: "INTRADAY Margin",
      type: "percentage",
      label_size: 12,
      col_size: 6,
      disable: false,
      min: 0,
      max: 12,
    },


    {
      name: "selectedOption",
      label: "Select One Option",
      type: "select",
      options: [
        { value: "pertrade", label: "Per Trade" },
        { value: "perlot", label: "Per Lot" },
        { value: "transactionwise", label: "Transaction Wise" },
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
      btn_name1_route={"/admin/users"}
    />
  );
};

export default Updateuser;
