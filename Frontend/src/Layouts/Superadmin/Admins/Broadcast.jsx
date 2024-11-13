import React, { useState, useEffect } from 'react';
import { broadcastmessage, getbroadcastmessage } from "../../../Services/Admin/Addmin"
import Swal from "sweetalert2";
import Table from '../../../Utils/Table/Table';
import { fDateTime } from '../../../Utils/Date_format/datefromat';


const Broadcast = () => {
    const userDetails = JSON.parse(localStorage.getItem("user_details"));
    const user_id = userDetails?.user_id;
    const Role = userDetails?.Role;
     const username = userDetails?.UserName 

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [refresh,setRefresh] = useState(false)

    const [message, setmessage] = useState({
        message: "",
        title: "",
        adminid: "",
        Role: "",
        UserName:""
    });


    const sendmessage = async () => {
        try {
            const response = await broadcastmessage({
                message: message.message,
                title: message.title,
                adminid: user_id,
                Role: Role,
                UserName:username
            });

            if (!message.title || !message.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Alert',
                    text: 'Please fill in the input fields.',
                    confirmButtonText: 'OK'
                });
                return; 
            }


            if (response.status) {
                setmessage({
                    message: "",
                    title: "",
                    adminid: "",
                    Role: ""
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent',
                    text: 'Your message was successfully sent!',
                    confirmButtonText: 'OK'
                    
                });
                fetchBroadcastMessages();
               
            }
           
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Send',
                text: 'Failed to send the message. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };


    const columns = [
        { Header: "Title", accessor: "title" },
        { Header: "Message", accessor: "message" },
        {
            Header: "Create Date",
            accessor: "createdAt",
            Cell: ({ cell }) => fDateTime(cell.value),
        },
    ];


    const fetchBroadcastMessages = async () => {
        try {
            const requestData = { userid: user_id };
            const response = await getbroadcastmessage(requestData);

            if (response.data && Array.isArray(response.data)) {
                const searchfilter = response.data.filter((item) => {
                    const searchInputMatch =
                        search === "" ||
                        (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
                        (item.message && item.message.toLowerCase().includes(search.toLowerCase()));

                    return searchInputMatch;
                });

                setData(search ? searchfilter : response.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log("error", error);
        }
    };




    useEffect(() => {
        fetchBroadcastMessages();
    }, [search]);


    return (

        <>
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header flex-wrap border-0">
                                    <h4 className="card-title">Broadcast</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xl-12 col-xxl-12">
                                            <div>
                                                <div className="d-flex align-items-center">
                                                    <h4 className="card-title d-sm-none d-block">Email</h4>
                                                    <div className="email-tools-box float-end mb-2">
                                                        <i className="fa-solid fa-list-ul" />
                                                    </div>
                                                </div>
                                                <div className="compose-content">
                                                    <form action="#">
                                                        <div className="mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control bg-transparent"
                                                                placeholder="Title:"
                                                                value={message.title}
                                                                onChange={(e) => setmessage({ ...message, title: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <textarea
                                                                id="email-compose-editor"
                                                                className="textarea_editor form-control bg-transparent"
                                                                rows={8}
                                                                placeholder="Enter text ..."
                                                                value={message.message}
                                                                onChange={(e) => setmessage({ ...message, message: e.target.value })}
                                                            />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="text-start mt-4 mb-3">
                                                    <button
                                                        className="btn btn-primary btn-sl-sm me-2"
                                                        type="button"
                                                        onClick={sendmessage}
                                                    >
                                                        <span className="me-2">
                                                            <i className="fa fa-paper-plane" />
                                                        </span>
                                                        Send
                                                    </button>
                                                    <button
                                                        className="btn btn-danger light btn-sl-sm"
                                                        type="button"
                                                    >
                                                        <span className="me-2">
                                                            <i className="fa fa-times" />
                                                        </span>
                                                        Discard
                                                    </button>
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

            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card transaction-table">
                                <div className="card-header border-0 flex-wrap pb-0">
                                    <div className="mb-4">
                                        <h4 className="card-title">BroadCast Message</h4>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="tab-content" id="myTabContent1">
                                        <div
                                            className="tab-pane fade show active"
                                            id="Week"
                                            role="tabpanel"
                                            aria-labelledby="Week-tab"
                                        >
                                            <div className="mb-3 ms-4">
                                                Search :{" "}
                                                <input
                                                    className="ml-2 input-search form-control"
                                                    style={{ width: "20%" }}
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                            </div>
                                            <Table columns={columns} data={data || []} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>


    );
}

export default Broadcast;
