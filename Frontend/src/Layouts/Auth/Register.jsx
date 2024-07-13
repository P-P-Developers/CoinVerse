import React from 'react';

const Register = () => {
  return (
    <div>
          <div className="vh-100">
              <div className="fix-wrapper">
                  <div className="container ">
                      <div className="row justify-content-center">
                          <div className="col-lg-5 col-md-6">
                              <div className="card mb-0 h-auto">
                                  <div className="card-body">
                                      <div className="text-center mb-2">
                                          <a href="/vite/demo/login">
                                              <img
                                                  src="data:image/png;base64,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"
                                                  alt=""
                                              />
                                          </a>
                                      </div>
                                      <h4 className="text-center mb-4 ">Sign up your account</h4>
                                      <form>
                                          <div className="form-group">
                                              <label className="form-label">Username</label>
                                              <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="username"
                                              />
                                          </div>
                                          <div className="form-group">
                                              <label className="form-label">Email</label>
                                              <input
                                                  className="form-control"
                                                  placeholder="email"
                                                  defaultValue=""
                                              />
                                          </div>
                                          <div className="mb-4 position-relative">
                                              <label className="form-label">Password</label>
                                              <input
                                                  className="form-control"
                                                  placeholder="password"
                                                  type="password"
                                                  defaultValue=""
                                              />
                                              <span className="show-pass eye ">
                                                  <i className="fa fa-eye-slash" />
                                                  <i className="fa fa-eye" />
                                              </span>
                                          </div>
                                          <div className="text-center mt-4">
                                              <button type="submit" className="btn btn-primary btn-block">
                                                  Sign me up
                                              </button>
                                          </div>
                                      </form>
                                      <div className="new-account mt-3">
                                          <p className="">
                                              Already have an account?{" "}
                                              <a className="text-primary" href="/vite/demo/login">
                                                  Sign in
                                              </a>
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

    </div>
  );
}

export default Register;
