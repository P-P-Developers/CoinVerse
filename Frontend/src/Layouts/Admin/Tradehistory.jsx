import React from 'react';

const Tradehistory = () => {
  return (
    <div>
          <div className='row'>


              <div className='demo-view'>
                  <div className='container-fluid'>
                      <div className='row'>
                          <div className="col-xl-12">
                              <div className="card dz-card" id="nav-pills">
                                  <div className="card-header flex-wrap border-0">
                                      <h4 className="card-title">Trade History</h4>

                                  </div>
                                  <div className="tab-content" id="myTabContent3">
                                      <div
                                          className="tab-pane fade show active"
                                          id="NavPills"
                                          role="tabpanel"
                                          aria-labelledby="home-tab3"
                                      >
                                          <div className="card-body pt-0">
                                           
                                              <div className="tab-content">
                                                  <div id="navpills-1" className="tab-pane active">
                                                      <div className="row">
                                                          <div className="col-lg-12">
                                                              <div className="card transaction-table">

                                                                  <div className="card-body p-0">
                                                                      <div className="tab-content" id="myTabContent1">
                                                                          <div
                                                                              className="tab-pane fade show active"
                                                                              id="Week"
                                                                              role="tabpanel"
                                                                              aria-labelledby="Week-tab"
                                                                          >
                                                                              <div className="table-responsive">
                                                                                  <div className='mb-2'>
                                                                                      Search :{" "}
                                                                                      <input
                                                                                          className="ml-2 input-search form-control"
                                                                                          defaultValue=""
                                                                                          style={{ width: "20%" }}
                                                                                      />
                                                                                  </div>

                                                                                  <table className="table table-responsive-md">
                                                                                      <thead>
                                                                                          <tr>
                                                                                              <th>#</th>
                                                                                              <th>Username</th>
                                                                                              <th>Start Date</th>
                                                                                              <th>End Date</th>

                                                                                          </tr>
                                                                                      </thead>
                                                                                      <tbody>
                                                                                          <tr>

                                                                                              <td>1</td>
                                                                                              <td>Donalt</td>
                                                                                              <td>01 August 2020</td>
                                                                                              <td>01 August 2020</td>




                                                                                          </tr>
                                                                                          <tr>

                                                                                              <td>2</td>
                                                                                              <td>Donalt</td>
                                                                                              <td>01 August 2020</td>
                                                                                              <td>01 August 2020</td>




                                                                                          </tr>
                                                                                          <tr>

                                                                                              <td>3</td>
                                                                                              <td>Donalt</td>
                                                                                              <td>01 August 2020</td>
                                                                                              <td>01 August 2020</td>




                                                                                          </tr>
                                                                                      </tbody>
                                                                                  </table>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>

                                                      </div>
                                                  </div>
                                              
                                              </div>
                                          </div>
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

export default Tradehistory;
