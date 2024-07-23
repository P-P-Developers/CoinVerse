import React from 'react';

const Withdraw = () => {
    return (
        <div>
            <div className='row'>
                <div className='demo-view'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className="col-xl-12">
                                <div className="card dz-card" id="nav-pills">
                                    <div className="card-header flex-wrap border-0">
                                        <h4 className="card-title">Withdrawl</h4>

                                    </div>
                                    <div className="tab-content" id="myTabContent3">
                                        <div
                                            className="tab-pane fade show active"
                                            id="NavPills"
                                            role="tabpanel"
                                            aria-labelledby="home-tab3"
                                        >
                                            <div className="card-body pt-0">
                                                <ul className="nav nav-pills nav-pills1 mb-4 light">
                                                    <li className="nav-item">
                                                        <a
                                                            href="#navpills-1"
                                                            className="nav-link active navlink"
                                                            data-bs-toggle="tab"
                                                            aria-expanded="false"
                                                        >
                                                            Pending
                                                        </a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a
                                                            href="#navpills-2"
                                                            className="nav-link navlink"
                                                            data-bs-toggle="tab"
                                                            aria-expanded="false"
                                                        >
                                                            Complete
                                                        </a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a
                                                            href="#navpills-3"
                                                            className="nav-link navlink"
                                                            data-bs-toggle="tab"
                                                            aria-expanded="true"
                                                        >
                                                            Reject
                                                        </a>
                                                    </li>
                                                </ul>
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
                                                    <div id="navpills-2" className="tab-pane">
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
                                                                                    <div className="mb-2">
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
                                                                                                <td>MS Dhoni</td>
                                                                                                <td>01 August 2020</td>
                                                                                                <td>02 August 2024</td>




                                                                                            </tr>
                                                                                            <tr>

                                                                                                <td>2</td>
                                                                                                <td>Donalt Trump</td>
                                                                                                <td>01 August 2020</td>
                                                                                                <td>03 August 2024</td>




                                                                                            </tr>
                                                                                            <tr>

                                                                                                <td>3</td>
                                                                                                <td>Donalt kesh</td>
                                                                                                <td>01 August 2020</td>
                                                                                                <td>05 August 2025</td>




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
                                                    <div id="navpills-3" className="tab-pane">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <p className='text-center'>There are no records to display</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="NavPills-html"
                                            role="tabpanel"
                                            aria-labelledby="home-tab3"
                                        >
                                            <div className="card-body p-0 code-area">
                                                <pre className="m-0">
                                                    <code className="language-html">
                                                        &lt;ul class="nav nav-pills mb-4 light"&gt;{"\n"}
                                                        {"\t"}&lt;li class=" nav-item"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;a href="#navpills-1" class="nav-link active"
                                                        data-bs-toggle="tab" aria-expanded="false"&gt;Tab One&lt;/a&gt;
                                                        {"\n"}
                                                        {"\t"}&lt;/li&gt;{"\n"}
                                                        {"\t"}&lt;li class="nav-item"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;a href="#navpills-2" class="nav-link"
                                                        data-bs-toggle="tab" aria-expanded="false"&gt;Tab Two&lt;/a&gt;
                                                        {"\n"}
                                                        {"\t"}&lt;/li&gt;{"\n"}
                                                        {"\t"}&lt;li class="nav-item"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;a href="#navpills-3" class="nav-link"
                                                        data-bs-toggle="tab" aria-expanded="true"&gt;Tab Three&lt;/a&gt;
                                                        {"\n"}
                                                        {"\t"}&lt;/li&gt;{"\n"}&lt;/ul&gt;{"\n"}&lt;div
                                                        class="tab-content"&gt;{"\n"}
                                                        {"\t"}&lt;div id="navpills-1" class="tab-pane active"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;div class="row"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;div class="col-md-12"&gt; Raw denim you probably haven't
                                                        heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua,
                                                        retro synth master cleanse. Mustache cliche tempor, williamsburg
                                                        carles vegan helvetica.{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;p&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;br /&gt; Reprehenderit butcher retro keffiyeh
                                                        dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry
                                                        richardson ex squid.&lt;/p&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}&lt;div id="navpills-2" class="tab-pane"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;div class="row"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;div class="col-md-12"&gt; Raw denim you probably haven't
                                                        heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua,
                                                        retro synth master cleanse. Mustache cliche tempor, williamsburg
                                                        carles vegan helvetica.{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;p&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;br /&gt; Reprehenderit butcher retro keffiyeh
                                                        dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry
                                                        richardson ex squid.&lt;/p&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}&lt;div id="navpills-3" class="tab-pane"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;div class="row"&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;div class="col-md-12"&gt; Raw denim you probably haven't
                                                        heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua,
                                                        retro synth master cleanse. Mustache cliche tempor, williamsburg
                                                        carles vegan helvetica.{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;p&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;br /&gt; Reprehenderit butcher retro keffiyeh
                                                        dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry
                                                        richardson ex squid.&lt;/p&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}
                                                        {"\t"}&lt;/div&gt;{"\n"}
                                                        {"\t"}&lt;/div&gt;{"\n"}&lt;/div&gt;
                                                    </code>
                                                </pre>
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



export default Withdraw;
