import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  UpdateUpiDetails,
  DeleteAdminBankdetails,
  getUpiDetails,
} from "../../../Services/Admin/Addmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Changedpassword = () => {
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;
  const [bankDetails, setBankDetails] = useState({
    walleturl: "",
    qrCodeBase64: "",
  });

  const [errors, setErrors] = useState({});


  const fetchBankDetails = async () => {
    try {
      const res = await getUpiDetails({ id: user_id });
      if (res.status) {
        setBankDetails(res.data);
      }
    } catch (err) { }
  };


  useEffect(() => {
    fetchBankDetails();
  }, []);


  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };



  const validateForm = () => {
    const newErrors = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleQRUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBankDetails((prev) => ({
        ...prev,
        qrCodeBase64: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };




  const handleBankSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Form",
        text: "Please correct the errors",
      });
      return;
    }

    try {
      const res = await UpdateUpiDetails({ ...bankDetails, id: user_id });
      if (res.status) {
        Swal.fire({ icon: "success", title: "Updated", text: res.message });

      }
      fetchBankDetails()
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to update bank details",
      });
    }
  };


  const DeleteBankDetails = async (e) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const data = { id: bankDetails._id };
          const response = await DeleteAdminBankdetails(data);
          if (response.status) {
            Swal.fire({
              icon: "success",
              title: response.message,
              text: "Details deleted successfully",
            }).then(() => {
              window.location.reload()
            })

          } else {
            Swal.fire({
              icon: "error",
              title: response.message,
              text: "",
            });
          }
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Internal Error",
        text: "Something went wrong internally",
      });
    }
  };






  return (
    <div className="container-fluid" style={{ minHeight: 723 }}>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card profile-card card-bx">
            <div className="card-header">
              <h6 className="card-title">Account Setup</h6>
            </div>
            <div className="card-footer d-flex align-items-end justify-content-end">
              <button type="submit" className="btn btn-danger btn-sm" onClick={DeleteBankDetails}>
                Delete Account
              </button>
            </div>
            <form className="profile-form mt-4" onSubmit={handleBankSubmit}>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-4 mb-3">
                    <label className="form-label">Wallet Url</label>
                    <input
                      type="text"
                      name="walleturl"
                      value={bankDetails.walleturl}
                      onChange={handleBankChange}
                      className={`form-control ${errors.walleturl ? "is-invalid" : ""
                        }`}
                      placeholder="Enter UPI ID"
                    />
                    {errors.walleturl && (
                      <div className="invalid-feedback">{errors.walleturl}</div>
                    )}
                  </div>

                  <div className="col-sm-4 mb-3">
                    <label className="form-label">Upload QR Code Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleQRUpload}
                    />
                  </div>

                  {/* Optional preview */}
                  {bankDetails.qrCodeBase64 && (
                    <div className="col-sm-4 mb-3">
                      <label className="form-label">Preview</label>
                      <img
                        src={bankDetails.qrCodeBase64}
                        alt="QR Preview"
                        className="img-fluid"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer d-flex align-items-center">
                <button type="submit" className="btn btn-success btn-sm">
                  Update Bank Info
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changedpassword;
