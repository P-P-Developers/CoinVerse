import React, { useState } from 'react';
import { PasswordChanged } from '../../../Services/Auth/Auth';
import Swal from "sweetalert2";

const Changedpassword = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: "New password and confirm password do not match",
        confirmButtonText: 'OK'
      });
      return;
    }
    
    try {
      const response = await PasswordChanged({
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
        userid: user_id
      });

      if (response.status) {
        setPassword({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });

        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: response.message,
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: "Internal error",
        confirmButtonText: 'OK'
      });
    }
  };


  return (
    <div>
    
      <div className="container-fluid" style={{ minHeight: 723 }} >
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card profile-card card-bx">
              <div className="card-header">
                <h6 className="card-title">Bank A </h6>
              </div>
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-4 mb-3">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your current password"
                        name="oldPassword"
                        value={password.oldPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-4 mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your new password"
                        name="newPassword"
                        value={password.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-4 mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm your new password"
                        name="confirmPassword"
                        value={password.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer align-items-center d-flex">
                  <button type="submit" className="btn btn-primary btn-sm">
                    UPDATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changedpassword;
