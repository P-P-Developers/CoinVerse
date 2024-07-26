import React from 'react';

const Holdoff = () => {
    return (
        <div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card transaction-table">
                            <div class="card-header border-0 flex-wrap pb-0">
                                <div class="mb-3">
                                    <h4 class="card-title">Hold off</h4>

                                </div>

                            </div>
                            <div class="card-body p-0">
                                <div class="tab-content" id="myTabContent1">
                                    <div
                                        class="tab-pane fade show active"
                                        id="Week"
                                        role="tabpanel"
                                        aria-labelledby="Week-tab"
                                    >
                                        <div class="table-responsive">
                                            <div className='mb-3 ms-4'>
                                                Search :{" "}
                                                <input
                                                    className="ml-2 input-search form-control"
                                                    defaultValue=""
                                                    style={{ width: "20%" }}
                                                />
                                            </div>
                                            <table class="table table-responsive-md">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Transaction ID</th>
                                                        <th>Date</th>
                                                        <th>From</th>
                                                        <th>To</th>
                                                        <th>Coin</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            1
                                                        </td>
                                                        <td>#1241534</td>
                                                        <td>01 August 2020</td>
                                                        <td>Thomas</td>
                                                        <td>

                                                            Dr. Jackson

                                                        </td>
                                                        <td>

                                                            Bitcoin

                                                        </td>
                                                        <td class="text-success font-w600">+$5,553</td>
                                                        <td class="d-flex ">
                                                            <div class="badge badge-sm badge-danger me-2">
                                                                Hold-off
                                                            </div>
                                                            <div class="badge badge-sm badge-success">
                                                                Release
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            2
                                                        </td>
                                                        <td>#1241534</td>
                                                        <td>01 August 2020</td>
                                                        <td>Thomas</td>
                                                        <td>

                                                            Dr. Jackson

                                                        </td>
                                                        <td>

                                                            Bitcoin

                                                        </td>
                                                        <td class="text-success font-w600">+$5,553</td>

                                                        <td class="d-flex ">
                                                            <div class="badge badge-sm badge-danger me-2">
                                                                Hold-off
                                                            </div>
                                                            <div class="badge badge-sm badge-success">
                                                                Release
                                                            </div>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            3
                                                        </td>
                                                        <td>#12415346</td>
                                                        <td>01 August 2020</td>
                                                        <td>Thomas</td>
                                                        <td>

                                                            Dr. Jackson

                                                        </td>
                                                        <td>

                                                            Bitcoin

                                                        </td>
                                                        <td class="text-danger font-w600">+$5,553</td>
                                                        <td class="d-flex ">
                                                            <a href='#' class="badge badge-sm badge-danger me-2">
                                                                Hold-off
                                                            </a>
                                                            <a href="" class="badge badge-sm badge-success">
                                                                Release
                                                            </a>
                                                        </td>
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
    );
}

export default Holdoff;
