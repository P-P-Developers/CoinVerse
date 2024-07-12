import React from 'react'

const Sidebar = () => {
    return (
        <div>
            <div className="dlabnav follow-info">

                <span className="main-menu">Main Menu</span>
                <div className="menu-scroll">
                    <div className="dlabnav-scroll mm-active">
                        <ul className="metismenu mm-show" id="menu">
                            <li className="mm-active">
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">dashboard</i>
                                    <span className="nav-text">Dashboard</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">monitoring</i>
                                    <span className="nav-text">Reports</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">monetization_on</i>
                                    <span className="nav-text">Client</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">lab_profile</i>
                                    <span className="nav-text">Trade History</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">apps_outage</i>
                                    <span className="nav-text">Trading Status</span>
                                </a>

                            </li>
                            <li>
                                <a
                                    className="ai-icon"
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="fa-regular fa-gear fw-bold" />
                                    <span className="nav-text"> Available Positions</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">donut_large</i>
                                    <span className="nav-text"> Withdrawal History</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">favorite</i>
                                    <span className="nav-text"> Deposit History</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">scatter_plot</i>
                                    <span className="nav-text"> System</span>
                                </a>

                            </li>
                            <li>
                                <a href="widget-basic.html" className="" aria-expanded="false">
                                    <i className="material-symbols-outlined">widgets</i>
                                    <span className="nav-text">Widget</span>
                                </a>
                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">request_quote</i>
                                    <span className="nav-text">Forms</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">table_chart</i>
                                    <span className="nav-text">Table</span>
                                </a>

                            </li>
                            <li>
                                <a

                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">lab_profile</i>
                                    <span className="nav-text">Pages</span>
                                </a>

                            </li>
                        </ul>

                    </div>
                </div>
            </div>
            <div className=" wallet-overlay">
                <div className="wallet-bar dlab-scroll" id="wallet-bar">
                    <div className="closed-icon">
                        <i className="fa-solid fa-xmark" />
                    </div>
                    <div className="wallet-card">
                        <div className="wallet-wrapper">
                            <div className="mb-3">
                                <h5 className="fs-14 font-w400 mb-0">My Portfolio</h5>
                                <h4 className="fs-24 font-w600">$34,010.00</h4>
                            </div>
                            <div className="text-end mb-2">
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        version="1.1"
                                        className="svg-main-icon"
                                    >
                                        <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                            <rect x={0} y={0} width={24} height={24} />
                                            <rect
                                                fill="#ffff"
                                                opacity="0.3"
                                                x={12}
                                                y={4}
                                                width={3}
                                                height={13}
                                                rx="1.5"
                                            />
                                            <rect
                                                fill="#ffff"
                                                opacity="0.3"
                                                x={7}
                                                y={9}
                                                width={3}
                                                height={8}
                                                rx="1.5"
                                            />
                                            <path
                                                d="M5,19 L20,19 C20.5522847,19 21,19.4477153 21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 C4.55228475,3 5,3.44771525 5,4 L5,19 Z"
                                                fill="#ffff"
                                                fillRule="nonzero"
                                            />
                                            <rect
                                                fill="#ffff"
                                                opacity="0.3"
                                                x={17}
                                                y={11}
                                                width={3}
                                                height={6}
                                                rx="1.5"
                                            />
                                        </g>
                                    </svg>
                                </span>
                                <span className="fs-14 d-block">+2.25%</span>
                            </div>
                        </div>
                        <div className="change-btn-1">
                            <a
                                href="javascript:void(0);"
                                className="btn btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                            >
                                <svg
                                    className="me-2 svg-main-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                    version="1.1"
                                >
                                    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                        <rect x={0} y={0} width={24} height={24} />
                                        <path
                                            d="M2,13 C2,12.5 2.5,12 3,12 C3.5,12 4,12.5 4,13 C4,13.3333333 4,15 4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 C2,15 2,13.3333333 2,13 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            opacity="0.3"
                                        />
                                        <rect
                                            fill="#000000"
                                            opacity="0.3"
                                            transform="translate(12.000000, 8.000000) rotate(-180.000000) translate(-12.000000, -8.000000) "
                                            x={11}
                                            y={1}
                                            width={2}
                                            height={14}
                                            rx={1}
                                        />
                                        <path
                                            d="M7.70710678,15.7071068 C7.31658249,16.0976311 6.68341751,16.0976311 6.29289322,15.7071068 C5.90236893,15.3165825 5.90236893,14.6834175 6.29289322,14.2928932 L11.2928932,9.29289322 C11.6689749,8.91681153 12.2736364,8.90091039 12.6689647,9.25670585 L17.6689647,13.7567059 C18.0794748,14.1261649 18.1127532,14.7584547 17.7432941,15.1689647 C17.3738351,15.5794748 16.7415453,15.6127532 16.3310353,15.2432941 L12.0362375,11.3779761 L7.70710678,15.7071068 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            transform="translate(12.000004, 12.499999) rotate(-180.000000) translate(-12.000004, -12.499999) "
                                        />
                                    </g>
                                </svg>
                                Deposit
                            </a>
                            <a
                                href="javascript:void(0);"
                                className="btn btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal2"
                            >
                                <svg
                                    className="me-2 svg-main-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                    version="1.1"
                                >
                                    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                        <rect x={0} y={0} width={24} height={24} />
                                        <path
                                            d="M2,13 C2,12.5 2.5,12 3,12 C3.5,12 4,12.5 4,13 C4,13.3333333 4,15 4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 C2,15 2,13.3333333 2,13 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            opacity="0.3"
                                        />
                                        <rect
                                            fill="#000000"
                                            opacity="0.3"
                                            x={11}
                                            y={2}
                                            width={2}
                                            height={14}
                                            rx={1}
                                        />
                                        <path
                                            d="M12.0362375,3.37797611 L7.70710678,7.70710678 C7.31658249,8.09763107 6.68341751,8.09763107 6.29289322,7.70710678 C5.90236893,7.31658249 5.90236893,6.68341751 6.29289322,6.29289322 L11.2928932,1.29289322 C11.6689749,0.916811528 12.2736364,0.900910387 12.6689647,1.25670585 L17.6689647,5.75670585 C18.0794748,6.12616487 18.1127532,6.75845471 17.7432941,7.16896473 C17.3738351,7.57947475 16.7415453,7.61275317 16.3310353,7.24329415 L12.0362375,3.37797611 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                        />
                                    </g>
                                </svg>
                                Withdraw
                            </a>
                        </div>
                    </div>
                    <div className="order-history">
                        <div className="card price-list-1 mb-0">
                            <div className="card-header border-0 pb-2 px-3">
                                <div>
                                    <h4 className="text-primary card-title mb-2">Buy Order</h4>
                                </div>
                                <div className="dropdown custom-dropdown">
                                    <div
                                        className="btn sharp btn-primary tp-btn"
                                        data-bs-toggle="dropdown"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            width="18px"
                                            height="18px"
                                            viewBox="0 0 24 24"
                                            version="1.1"
                                        >
                                            <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                                <rect x={0} y={0} width={24} height={24} />
                                                <circle fill="#000000" cx={12} cy={5} r={2} />
                                                <circle fill="#000000" cx={12} cy={12} r={2} />
                                                <circle fill="#000000" cx={12} cy={19} r={2} />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <a className="dropdown-item" href="#">
                                            Option 1
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Option 2
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Option 3
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-3 py-0">
                                <div className="dropdown bootstrap-select form-control custom-image-select-2 image-select mt-3 mt-sm-0 style-1">
                                    <select className="form-control custom-image-select-2 image-select mt-3 mt-sm-0 style-1">
                                        <option
                                            data-thumbnail="images/svg/dash.svg"
                                            data-content="<img src='images/svg/dash.svg'/> Dash Coin"
                                        >
                                            Dash Coin
                                        </option>
                                        <option
                                            data-thumbnail="images/svg/btc.svg"
                                            data-content="<img src='images/svg/btc.svg'/> Ripple"
                                        >
                                            Ripple
                                        </option>
                                        <option
                                            data-thumbnail="images/svg/eth.svg"
                                            data-content="<img src='images/svg/eth.svg'/> Ethereum"
                                        >
                                            Ethereum
                                        </option>
                                        <option
                                            data-thumbnail="images/svg/btc.svg"
                                            data-content="<img src='images/svg/btc.svg'/> Bitcoin"
                                        >
                                            Bitcoin
                                        </option>
                                    </select>
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="btn dropdown-toggle btn-light"
                                        data-bs-toggle="dropdown"
                                        role="combobox"
                                        aria-owns="bs-select-1"
                                        aria-haspopup="listbox"
                                        aria-expanded="false"
                                        title="Dash Coin"
                                    >
                                        <div className="filter-option">
                                            <div className="filter-option-inner">
                                                <div className="filter-option-inner-inner">
                                                    <img src="images/svg/dash.svg" /> Dash Coin
                                                </div>
                                            </div>{" "}
                                        </div>
                                    </button>
                                    <div className="dropdown-menu ">
                                        <div
                                            className="inner show"
                                            role="listbox"
                                            id="bs-select-1"
                                            tabIndex={-1}
                                        >
                                            <ul className="dropdown-menu inner show" role="presentation" />
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table text-center bg-primary-hover tr-rounded order-tbl mt-2 ">
                                        <thead>
                                            <tr>
                                                <th className="text-start">Price</th>
                                                <th className="text-center">Amount</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-start">82.3</td>
                                                <td>0.15</td>
                                                <td className="text-end">$134,12</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">83.9</td>
                                                <td>0.18</td>
                                                <td className="text-end">$237,31</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">84.2</td>
                                                <td>0.25</td>
                                                <td className="text-end">$252,58</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">86.2</td>
                                                <td>0.35</td>
                                                <td className="text-end">$126,26</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">91.6</td>
                                                <td>0.75</td>
                                                <td className="text-end">$46,92</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">92.6</td>
                                                <td>0.21</td>
                                                <td className="text-end">$123,27</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">93.9</td>
                                                <td>0.55</td>
                                                <td className="text-end">$212,56</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">94.2</td>
                                                <td>0.18</td>
                                                <td className="text-end">$129,26</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer text-center py-2">
                                <a href="coin-details.html" className="btn-link text-primary">
                                    Show more <i className="fa fa-caret-right ms-2" />
                                </a>
                            </div>
                        </div>
                        <div className="card price-list style-2 border-top border-style">
                            <div className="card-header border-0 pb-2 px-3">
                                <div>
                                    <h4 className="text-pink mb-2 card-title">Sell Order</h4>
                                </div>
                                <div className="dropdown custom-dropdown">
                                    <div
                                        className="btn sharp btn-pink tp-btn"
                                        data-bs-toggle="dropdown"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            width="18px"
                                            height="18px"
                                            viewBox="0 0 24 24"
                                            version="1.1"
                                        >
                                            <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                                <rect x={0} y={0} width={24} height={24} />
                                                <circle fill="#000000" cx={12} cy={5} r={2} />
                                                <circle fill="#000000" cx={12} cy={12} r={2} />
                                                <circle fill="#000000" cx={12} cy={19} r={2} />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <a className="dropdown-item" href="#">
                                            Option 1
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Option 2
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Option 3
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-3 py-0">
                                <div className="dropdown bootstrap-select form-control custom-image-select-2 style-1 image-select mt-3 mt-sm-0 pink-light">
                                    <select className="form-control custom-image-select-2 style-1 image-select mt-3 mt-sm-0 pink-light">
                                        <option
                                            data-thumbnail="images/svg/dash-pink.svg"
                                            data-content="<img src='images/svg/dash-pink.svg'/> Dash Coin"
                                        >
                                            Dash Coin
                                        </option>
                                        <option
                                            data-thumbnail="images/svg/btc.svg"
                                            data-content="<img src='images/svg/btc.svg'/> Ripple"
                                        >
                                            Ripple
                                        </option>
                                        <option
                                            data-thumbnail="images/svg/eth.svg"
                                            data-content="<img src='images/svg/eth.svg'/> Ethereum"
                                        >
                                            Ethereum
                                        </option>
                                        <option
                                            data-thumbnail="images/svg/btc.svg"
                                            data-content="<img src='images/svg/btc.svg'/> Bitcoin"
                                        >
                                            Bitcoin
                                        </option>
                                    </select>
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="btn dropdown-toggle btn-light"
                                        data-bs-toggle="dropdown"
                                        role="combobox"
                                        aria-owns="bs-select-2"
                                        aria-haspopup="listbox"
                                        aria-expanded="false"
                                        title="Dash Coin"
                                    >
                                        <div className="filter-option">
                                            <div className="filter-option-inner">
                                                <div className="filter-option-inner-inner">
                                                    <img src="images/svg/dash-pink.svg" /> Dash Coin
                                                </div>
                                            </div>{" "}
                                        </div>
                                    </button>
                                    <div className="dropdown-menu ">
                                        <div
                                            className="inner show"
                                            role="listbox"
                                            id="bs-select-2"
                                            tabIndex={-1}
                                        >
                                            <ul className="dropdown-menu inner show" role="presentation" />
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table text-center bg-pink-hover tr-rounded order-tbl mt-2">
                                        <thead>
                                            <tr>
                                                <th className="text-start">Price</th>
                                                <th className="text-center">Amount</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-start">82.3</td>
                                                <td>0.15</td>
                                                <td className="text-end">$134,12</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">83.9</td>
                                                <td>0.18</td>
                                                <td className="text-end">$237,31</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">84.2</td>
                                                <td>0.25</td>
                                                <td className="text-end">$252,58</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">86.2</td>
                                                <td>0.35</td>
                                                <td className="text-end">$126,26</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">91.6</td>
                                                <td>0.75</td>
                                                <td className="text-end">$46,92</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">92.6</td>
                                                <td>0.21</td>
                                                <td className="text-end">$123,27</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">93.9</td>
                                                <td>0.55</td>
                                                <td className="text-end">$212,56</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start">94.2</td>
                                                <td>0.18</td>
                                                <td className="text-end">$129,26</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer text-center py-2">
                                <a href="coin-details.html" className="btn-link text-pink">
                                    Show more <i className="fa fa-caret-right ms-2" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wallet-bar-close" />


        </div>
    )
}

export default Sidebar
