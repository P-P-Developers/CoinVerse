import React from 'react';

const Setting = () => {
  return (
    <div>
      <div className="container-fluid" style={{ minHeight: 723 }}>
        <div className="row">

          <div className="col-xl-12 col-lg-12">
            <div className="card profile-card card-bx ">
              <div className="card-header">
                <h6 className="card-title">Account setup</h6>
              </div>
              <form className="profile-form">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-4 mb-3">
                      <label className="form-label">Current Passsword</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder='enter your current password'
                      />
                    </div>
                    <div className="col-sm-4 mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder='enter your new password'
                      />
                    </div>
                    <div className="col-sm-4 mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder='enter your confirm new password'
                      />
                    </div>

                  </div>
                </div>
                <div className="card-footer align-items-center d-flex">
                  <a
                    className="btn btn-primary btn-sm"
                    href="/vite/demo/edit-profile"
                  >
                    UPDATE
                  </a>
                  {/* <a
                                        className="btn-link float-end ms-auto"
                                        href="/vite/demo/edit-profile"
                                    >
                                        Forgot your password?
                                    </a> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Setting;

<div className="container-fluid" style={{ minHeight: 723 }}>
  <div className="row">
    <div className="col-xl-3 col-lg-4">
      <div className="clearfix">
        <div className="card card-bx profile-card author-profile mb-3">
          <div className="card-body">
            <div className="p-5">
              <div className="author-profile">
                <div className="author-media">
                  <img src="/vite/demo/assets/1-DA8M5-jZ.jpg" alt="" />
                  <div
                    className="upload-link"
                    title=""
                    data-toggle="tooltip"
                    data-placement="right"
                    data-original-title="update"
                  >
                    <input type="file" className="update-flie" />
                    <i className="fa fa-camera" />
                  </div>
                </div>
                <div className="author-info">
                  <h6 className="title">Nella Vita</h6>
                  <span>Developer</span>
                </div>
              </div>
            </div>
            <div className="info-list">
              <ul>
                <li>
                  <a href="/vite/demo/app-profile">Models</a>
                  <span>36</span>
                </li>
                <li>
                  <a href="/vite/demo/uc-lightgallery">Gallery</a>
                  <span>3</span>
                </li>
                <li>
                  <a href="/vite/demo/app-profile">Lessons</a>
                  <span>1</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="card-footer">
            <div className="input-group mb-3">
              <div className="form-control rounded text-center">Portfolio</div>
            </div>
            <div className="input-group">
              <a
                className="form-control text-primary rounded text-center"
                href="https://www.dexignlab.com/"
                target="_blank"
              >
                https://www.dexignlab.com/
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-xl-9 col-lg-8">
      <div className="card profile-card card-bx ">
        <div className="card-header">
          <h6 className="card-title">Account setup</h6>
        </div>
        <form className="profile-form">
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="John"
                />
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">Surname</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="Brahim"
                />
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">Specialty</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="Developer"
                />
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">Skills</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="React,  JavaScript,  PHP"
                />
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">Gender</label>
                <div className="custom-react-select css-b62m3t-container">
                  <span
                    id="react-select-30-live-region"
                    className="css-7pg0cj-a11yText"
                  />
                  <span
                    aria-live="polite"
                    aria-atomic="false"
                    aria-relevant="additions text"
                    role="log"
                    className="css-7pg0cj-a11yText"
                  />
                  <div className=" css-13cymwt-control">
                    <div className=" css-hlgwow">
                      <div className=" css-1dimb5e-singleValue">Male</div>
                      <input
                        id="react-select-30-input"
                        tabIndex={0}
                        inputMode="none"
                        aria-autocomplete="list"
                        aria-expanded="false"
                        aria-haspopup="true"
                        role="combobox"
                        aria-activedescendant=""
                        aria-readonly="true"
                        className="css-1hac4vs-dummyInput"
                        defaultValue=""
                      />
                    </div>
                    <div className=" css-1wy0on6">
                      <span className=" css-1u9des2-indicatorSeparator" />
                      <div
                        className=" css-1xc3v61-indicatorContainer"
                        aria-hidden="true"
                      >
                        <svg
                          height={20}
                          width={20}
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                          className="css-8mmkcg"
                        >
                          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 modal-date">
                <label className="form-label">Birth</label>
                <div className="input-hasicon mb-xl-0 mb-3">
                  <div className="react-datepicker-wrapper">
                    <div className="react-datepicker__input-container">
                      <input
                        type="text"
                        className="form-control bt-datepicker"
                        defaultValue="07/19/2024"
                      />
                    </div>
                  </div>
                  <div className="icon">
                    <i className="far fa-calendar" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="number"
                  className="form-control"
                  defaultValue={+123456789}
                />
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="demo@gmail.com"
                />
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">Country</label>
                <div className="custom-react-select css-b62m3t-container">
                  <span
                    id="react-select-31-live-region"
                    className="css-7pg0cj-a11yText"
                  />
                  <span
                    aria-live="polite"
                    aria-atomic="false"
                    aria-relevant="additions text"
                    role="log"
                    className="css-7pg0cj-a11yText"
                  />
                  <div className=" css-13cymwt-control">
                    <div className=" css-hlgwow">
                      <div className=" css-1dimb5e-singleValue">Canada</div>
                      <input
                        id="react-select-31-input"
                        tabIndex={0}
                        inputMode="none"
                        aria-autocomplete="list"
                        aria-expanded="false"
                        aria-haspopup="true"
                        role="combobox"
                        aria-activedescendant=""
                        aria-readonly="true"
                        className="css-1hac4vs-dummyInput"
                        defaultValue=""
                      />
                    </div>
                    <div className=" css-1wy0on6">
                      <span className=" css-1u9des2-indicatorSeparator" />
                      <div
                        className=" css-1xc3v61-indicatorContainer"
                        aria-hidden="true"
                      >
                        <svg
                          height={20}
                          width={20}
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                          className="css-8mmkcg"
                        >
                          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3">
                <label className="form-label">City</label>
                <div className="custom-react-select css-b62m3t-container">
                  <span
                    id="react-select-32-live-region"
                    className="css-7pg0cj-a11yText"
                  />
                  <span
                    aria-live="polite"
                    aria-atomic="false"
                    aria-relevant="additions text"
                    role="log"
                    className="css-7pg0cj-a11yText"
                  />
                  <div className=" css-13cymwt-control">
                    <div className=" css-hlgwow">
                      <div className=" css-1dimb5e-singleValue">Tyumen</div>
                      <input
                        id="react-select-32-input"
                        tabIndex={0}
                        inputMode="none"
                        aria-autocomplete="list"
                        aria-expanded="false"
                        aria-haspopup="true"
                        role="combobox"
                        aria-activedescendant=""
                        aria-readonly="true"
                        className="css-1hac4vs-dummyInput"
                        defaultValue=""
                      />
                    </div>
                    <div className=" css-1wy0on6">
                      <span className=" css-1u9des2-indicatorSeparator" />
                      <div
                        className=" css-1xc3v61-indicatorContainer"
                        aria-hidden="true"
                      >
                        <svg
                          height={20}
                          width={20}
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                          className="css-8mmkcg"
                        >
                          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer align-items-center d-flex">
            <a
              className="btn btn-primary btn-sm"
              href="/vite/demo/edit-profile"
            >
              UPDATE
            </a>
            <a
              className="btn-link float-end ms-auto"
              href="/vite/demo/edit-profile"
            >
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>