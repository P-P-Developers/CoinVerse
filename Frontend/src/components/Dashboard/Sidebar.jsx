import React from 'react'

const Sidebar = () => {
    return (
        <div>
            <div className="dlabnav follow-info">
                <div className="feature-box">
                    <div className="wallet-box">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="50px"
                            height="50px"
                            viewBox="0 0 24 24"
                            version="1.1"
                            className="svg-main-icon"
                        >
                            <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                <rect x={0} y={0} width={24} height={24} />
                                <circle fill="#fff" opacity="0.3" cx="20.5" cy="12.5" r="1.5" />
                                <rect
                                    fill="#fff"
                                    opacity="0.3"
                                    transform="translate(12.000000, 6.500000) rotate(-15.000000) translate(-12.000000, -6.500000) "
                                    x={3}
                                    y={3}
                                    width={18}
                                    height={7}
                                    rx={1}
                                />
                                <path
                                    d="M22,9.33681558 C21.5453723,9.12084552 21.0367986,9 20.5,9 C18.5670034,9 17,10.5670034 17,12.5 C17,14.4329966 18.5670034,16 20.5,16 C21.0367986,16 21.5453723,15.8791545 22,15.6631844 L22,18 C22,19.1045695 21.1045695,20 20,20 L4,20 C2.8954305,20 2,19.1045695 2,18 L2,6 C2,4.8954305 2.8954305,4 4,4 L20,4 C21.1045695,4 22,4.8954305 22,6 L22,9.33681558 Z"
                                    fill="#fff"
                                />
                            </g>
                        </svg>
                        <div className="ms-3">
                            <h4 className="text-white mb-0 d-block">$2353.25</h4>
                            <small>Withdraw Money</small>
                        </div>
                    </div>

                </div>
                <span className="main-menu">Main Menu</span>
                <div className="menu-scroll">
                    <div className="dlabnav-scroll mm-active">
                        <ul className="metismenu mm-show" id="menu">
                            <li className="mm-active">
                                <a
                                    className="has-arrow"
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">dashboard</i>
                                    <span className="nav-text">Dashboard</span>
                                </a>

                            </li>
                            <li>
                                <a
                                    className="has-arrow"
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">monitoring</i>
                                    <span className="nav-text">Trading</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="trading-market.html">Market</a>
                                    </li>
                                    <li>
                                        <a href="ico-listing.html">Ico Listing</a>
                                    </li>
                                    <li>
                                        <a href="p2p.html">P2P</a>
                                    </li>
                                    <li>
                                        <a href="future.html">Future</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow"
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">monetization_on</i>
                                    <span className="nav-text">Crypto</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="market-watch.html">Market Watch </a>
                                    </li>
                                    <li>
                                        <a href="exchange.html">Exchange</a>
                                    </li>
                                    <li>
                                        <a href="banking.html">Banking</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow"
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">lab_profile</i>
                                    <span className="nav-text">Reports</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="history.html">History</a>
                                    </li>
                                    <li>
                                        <a href="orders.html">Orders</a>
                                    </li>
                                    <li>
                                        <a href="reports.html">Report</a>
                                    </li>
                                    <li>
                                        <a href="user.html">User</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow "
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">apps_outage</i>
                                    <span className="nav-text">Apps</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="app-profile.html">Profile</a>
                                    </li>
                                    <li>
                                        <a href="edit-profile.html">Edit Profile</a>
                                    </li>
                                    <li>
                                        <a href="post-details.html">Post Details</a>
                                    </li>
                                    <li>
                                        <a
                                            className="has-arrow"
                                            href="javascript:void(0);"
                                            aria-expanded="false"
                                        >
                                            Email
                                        </a>
                                        <ul aria-expanded="false" className="mm-collapse left" style={{}}>
                                            <li>
                                                <a href="email-compose.html">Compose</a>
                                            </li>
                                            <li>
                                                <a href="email-inbox.html">Inbox</a>
                                            </li>
                                            <li>
                                                <a href="email-read.html">Read</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="app-calender.html">Calendar</a>
                                    </li>
                                    <li>
                                        <a
                                            className="has-arrow"
                                            href="javascript:void(0);"
                                            aria-expanded="false"
                                        >
                                            Shop
                                        </a>
                                        <ul aria-expanded="false" className="mm-collapse left" style={{}}>
                                            <li>
                                                <a href="ecom-product-grid.html">Product Grid</a>
                                            </li>
                                            <li>
                                                <a href="ecom-product-list.html">Product List</a>
                                            </li>
                                            <li>
                                                <a href="ecom-product-detail.html">Product Details</a>
                                            </li>
                                            <li>
                                                <a href="ecom-product-order.html">Order</a>
                                            </li>
                                            <li>
                                                <a href="ecom-checkout.html">Checkout</a>
                                            </li>
                                            <li>
                                                <a href="ecom-invoice.html">Invoice</a>
                                            </li>
                                            <li>
                                                <a href="ecom-customers.html">Customers</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow ai-icon"
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="fa-regular fa-gear fw-bold" />
                                    <span className="nav-text">CMS</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="content.html">Content</a>
                                    </li>
                                    <li>
                                        <a href="content-add.html">Add Content</a>
                                    </li>
                                    <li>
                                        <a href="menu.html">Menus</a>
                                    </li>
                                    <li>
                                        <a href="email-template.html">Email Template</a>
                                    </li>
                                    <li>
                                        <a href="add-email.html">Add Email</a>
                                    </li>
                                    <li>
                                        <a href="blog.html">Blog</a>
                                    </li>
                                    <li>
                                        <a href="add-blog.html">Add Blog</a>
                                    </li>
                                    <li>
                                        <a href="blog-category.html">Blog Category</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow "
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">donut_large</i>
                                    <span className="nav-text">Charts</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="chart-flot.html">Flot</a>
                                    </li>
                                    <li>
                                        <a href="chart-morris.html">Morris</a>
                                    </li>
                                    <li>
                                        <a href="chart-chartjs.html">Chartjs</a>
                                    </li>
                                    <li>
                                        <a href="chart-chartist.html">Chartist</a>
                                    </li>
                                    <li>
                                        <a href="chart-sparkline.html">Sparkline</a>
                                    </li>
                                    <li>
                                        <a href="chart-peity.html">Peity</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow "
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">favorite</i>
                                    <span className="nav-text">Bootstrap</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="ui-accordion.html">Accordion</a>
                                    </li>
                                    <li>
                                        <a href="ui-alert.html">Alert</a>
                                    </li>
                                    <li>
                                        <a href="ui-badge.html">Badge</a>
                                    </li>
                                    <li>
                                        <a href="ui-button.html">Button</a>
                                    </li>
                                    <li>
                                        <a href="ui-modal.html">Modal</a>
                                    </li>
                                    <li>
                                        <a href="ui-button-group.html">Button Group</a>
                                    </li>
                                    <li>
                                        <a href="ui-list-group.html">List Group</a>
                                    </li>
                                    <li>
                                        <a href="ui-card.html">Cards</a>
                                    </li>
                                    <li>
                                        <a href="ui-carousel.html">Carousel</a>
                                    </li>
                                    <li>
                                        <a href="ui-dropdown.html">Dropdown</a>
                                    </li>
                                    <li>
                                        <a href="ui-popover.html">Popover</a>
                                    </li>
                                    <li>
                                        <a href="ui-progressbar.html">Progressbar</a>
                                    </li>
                                    <li>
                                        <a href="ui-tab.html">Tab</a>
                                    </li>
                                    <li>
                                        <a href="ui-typography.html">Typography</a>
                                    </li>
                                    <li>
                                        <a href="ui-pagination.html">Pagination</a>
                                    </li>
                                    <li>
                                        <a href="ui-grid.html">Grid</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow "
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">scatter_plot</i>
                                    <span className="nav-text">Plugins</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="uc-select2.html">Select 2</a>
                                    </li>
                                    <li>
                                        <a href="uc-nestable.html">Nestedable</a>
                                    </li>
                                    <li>
                                        <a href="uc-noui-slider.html">Noui Slider</a>
                                    </li>
                                    <li>
                                        <a href="uc-sweetalert.html">Sweet Alert</a>
                                    </li>
                                    <li>
                                        <a href="uc-toastr.html">Toastr</a>
                                    </li>
                                    <li>
                                        <a href="map-jqvmap.html">Jqv Map</a>
                                    </li>
                                    <li>
                                        <a href="uc-lightgallery.html">Light Gallery</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="widget-basic.html" className="" aria-expanded="false">
                                    <i className="material-symbols-outlined">widgets</i>
                                    <span className="nav-text">Widget</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className="has-arrow "
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">request_quote</i>
                                    <span className="nav-text">Forms</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="form-element.html">Form Elements</a>
                                    </li>
                                    <li>
                                        <a href="form-wizard.html">Wizard</a>
                                    </li>
                                    <li>
                                        <a href="form-ckeditor.html">CkEditor</a>
                                    </li>
                                    <li>
                                        <a href="form-pickers.html">Pickers</a>
                                    </li>
                                    <li>
                                        <a href="form-validation.html">Form Validate</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow "
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">table_chart</i>
                                    <span className="nav-text">Table</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="table-bootstrap-basic.html">Bootstrap</a>
                                    </li>
                                    <li>
                                        <a href="table-datatable-basic.html">Datatable</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    className="has-arrow "
                                    href="javascript:void(0);"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-outlined">lab_profile</i>
                                    <span className="nav-text">Pages</span>
                                </a>
                                <ul aria-expanded="false" className="mm-collapse">
                                    <li>
                                        <a href="page-login.html">Login</a>
                                    </li>
                                    <li>
                                        <a href="page-register.html">Register</a>
                                    </li>
                                    <li>
                                        <a
                                            className="has-arrow"
                                            href="javascript:void(0);"
                                            aria-expanded="false"
                                        >
                                            Error
                                        </a>
                                        <ul aria-expanded="false" className="mm-collapse left" style={{}}>
                                            <li>
                                                <a href="page-error-400.html">Error 400</a>
                                            </li>
                                            <li>
                                                <a href="page-error-403.html">Error 403</a>
                                            </li>
                                            <li>
                                                <a href="page-error-404.html">Error 404</a>
                                            </li>
                                            <li>
                                                <a href="page-error-500.html">Error 500</a>
                                            </li>
                                            <li>
                                                <a href="page-error-503.html">Error 503</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="page-lock-screen.html">Lock Screen</a>
                                    </li>
                                    <li>
                                        <a href="empty-page.html">Empty Page</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div className="support-box">
                            <div className="media">
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        width={40}
                                        height={46}
                                        viewBox="0 0 40 46"
                                    >
                                        <image
                                            id="headphones_1_"
                                            data-name="headphones (1)"
                                            width={40}
                                            height={46}
                                            xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAuCAYAAABap1twAAAD90lEQVRYhdWZa4hVVRTHf3fUbOjJkGaSHzITShSitJjsTRQZZga9MSGoDxYmfesBamBp9GWo+VDSe7KXlRWEhUVRNllQiCVMhGXJaAk1Fo1G8pc9rBOL3b7nPs493ukPG9Z+rf2/a5+91tr7ViRRABOAM4DpwFTgRFP1K7ADGAC2A4PNLjG2yXnXANcD3cCUGmMDuX7gNSt/N7RSsGCd5UhJKyTtVPPYLWmNpOPqXbfeLV4ErAYmJfrCdm4Bvgf2ht8MdAGnArOBkxJzfgPuB3qLWnCcpHUJe30r6R5JJ9RhhWMlLZH0VULP29ZfdX6e4kmStkUKv5N0ixszxRbvk7RZ0nYr/ZJelrRM0jQ3foGkrZHOH6IxdRGcIGkwUtTj+hcbkXqxQ9Kdbv7D0bw/JE1thOBApGCR67s3h9RBK9XQF1nTY4+kzphLR+KzfBM4zdUvB55z9U4nBxfypLmd4A8nWzkduBp4Atjlxp8crXOOq08E3q91SG6IftXNCeuOkfSgpKUm1zokHZLuktQrqSvRf2W05tK8LR52A3sb8JFFy8qIZGeK4H1uwK7DSC4r/tA9liLorXddGwheHFlxnCfoT9RgG8ilrHi73Cm+zZ2bnprhpzw86jSH8DoSi4+3ONplHTOBbW0iGNzQTyYfAKYFC17gyO1vI7mAn4EfTR4PXNhhmUWGDe3j9i8+cHIlS7dCJDgTWAP82V5+Iyldj2Xjy4um/KUjFYtHFbI7yY3AKY7YMPAF8MlhIns2cB5wlGsLicjTwTnenZMerZc0tmTn/EzO+g+ELZ6b88sWAhtLtFwfcGtO/6zYzWwGHgHWubZLgEtLIDcLuMnV37C1fU44FN+LXwQeN3kfcIfJ84BNLSY4z8mvA9eavAC4LOuIT/FEJ3/j5DJO+5gqa032g/IWPsbJ/7SOV1Ln0U6u+EGj3g+ORoL/Pwse4ere5fzu5GZfwfLgdQ5V4TBCcL+re6ft76xlY3YVDiN3kvlReHlJ0gtR21UlhLg5ibAah7212eCNOfHw8xLj8Fs56wY8lR2SK4D3Etv4qYW6shCeR97N0a04Yb3IvoFA/LPkW0l1zLT5Ye5HwNcNzA33ovOB3cAyYIa1r2zVVvUltufVJvSE1G6f09HdCnKv5HxD7zSgp1vSkJu7SQ28UVfDWcCXrm+t3WeXuLaQQu2JkoMMBy2LDnrmu3bZ5emXotZ7yLsE176qxunMwwFJ52a6ioY6Hw2GnfxXk/rW20Nof9ZQdIvDyfvY1Vcb0eWu7Xn7e6KSmF+xT2KneYyB/wwoSDDgQ3MvKWwpGjJbkc2E9DyQjBHuN9WI141WviyE21n47y4gWO7Zwpk4cAiPK9af4ZZaXAAAAABJRU5ErkJggg=="
                                        />
                                    </svg>
                                </span>
                            </div>
                            <div className="info">
                                <p>Jiade Crypto Trading UI Template</p>
                                <a
                                    href="javascript:void(0);"
                                    className="btn bg-white text-black w-75 btn-sm"
                                >
                                    Supports
                                </a>
                            </div>
                        </div>
                        <div className="copyright">
                            <p>
                                <strong>Jiade Crypto Trading UI Template</strong> ©{" "}
                                <span className="current-year">2024</span> All Rights Reserved
                            </p>
                            <p className="fs-12">
                                Made with <span className="heart" /> by DexignLab
                            </p>
                        </div>
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
