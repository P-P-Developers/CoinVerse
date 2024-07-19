import React from 'react';

const Broadcast = () => {
    return (
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
                                                            placeholder=" To:"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control bg-transparent"
                                                            placeholder=" Subject:"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <textarea
                                                            id="email-compose-editor"
                                                            className="textarea_editor form-control bg-transparent"
                                                            rows={8}
                                                            placeholder="Enter text ..."
                                                            defaultValue={""}
                                                        />
                                                    </div>
                                                </form>


                                            </div>
                                            <div className="text-start mt-4 mb-3">
                                                <button
                                                    className="btn btn-primary btn-sl-sm me-2"
                                                    type="button"
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
    );
}

export default Broadcast;

<div className="container-fluid">
    {/* row */}
    <div className="row">
        <div className="col-lg-12">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-xl-3 col-xxl-4  email-left-body">
                            <div className="mb-3 mt-4 mt-sm-0 email-left-box">
                                <div className="p-0">
                                    <a
                                        href="email-compose.html"
                                        className="btn btn-primary btn-block"
                                    >
                                        Compose
                                    </a>
                                </div>
                                <div className="mail-list rounded mt-4">
                                    <a href="email-inbox.html" className="list-group-item active">
                                        <i className="fa fa-inbox font-18 align-middle me-2" />{" "}
                                        Inbox{" "}
                                        <span className="badge badge-light badge-sm float-end">
                                            198
                                        </span>{" "}
                                    </a>
                                    <a href="javascript:void(0);" className="list-group-item">
                                        <i className="fa fa-paper-plane font-18 align-middle me-2" />
                                        Sent
                                    </a>
                                    <a href="javascript:void(0);" className="list-group-item">
                                        <i className="fas fa-star font-18 align-middle me-2" />
                                        Important
                                        <span className="badge badge-danger text-white badge-sm float-end">
                                            47
                                        </span>
                                    </a>
                                    <a href="javascript:void(0);" className="list-group-item">
                                        <i className="mdi mdi-file-document-box font-18 align-middle me-2" />
                                        Draft
                                    </a>
                                    <a href="javascript:void(0);" className="list-group-item">
                                        <i className="fa fa-trash font-18 align-middle me-2" />
                                        Trash
                                    </a>
                                </div>
                                <div className="mail-list rounded overflow-hidden mt-4">
                                    <div className="intro-title d-flex justify-content-between my-0">
                                        <h5>Categories</h5>
                                    </div>
                                    <a href="email-inbox.html" className="list-group-item">
                                        <span className="icon-warning">
                                            <i className="fa fa-circle" />
                                        </span>
                                        Work{" "}
                                    </a>
                                    <a href="email-inbox.html" className="list-group-item">
                                        <span className="icon-primary">
                                            <i className="fa fa-circle" />
                                        </span>
                                        Private{" "}
                                    </a>
                                    <a href="email-inbox.html" className="list-group-item">
                                        <span className="icon-success">
                                            <i className="fa fa-circle" />
                                        </span>
                                        Support{" "}
                                    </a>
                                    <a href="email-inbox.html" className="list-group-item">
                                        <span className="icon-dpink">
                                            <i className="fa fa-circle" />
                                        </span>
                                        Social{" "}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-9 col-xxl-8">
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
                                                placeholder=" To:"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                className="form-control bg-transparent"
                                                placeholder=" Subject:"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <textarea
                                                id="email-compose-editor"
                                                className="textarea_editor form-control bg-transparent"
                                                rows={8}
                                                placeholder="Enter text ..."
                                                defaultValue={""}
                                            />
                                        </div>
                                    </form>
                                    <h5 className="mb-4">
                                        <i className="fa fa-paperclip" /> Attatchment
                                    </h5>
                                    <form action="#" className="dropzone dz-clickable">
                                        <div className="dz-default dz-message">
                                            <button className="dz-button" type="button">
                                                Drop files here to upload
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="text-start mt-4 mb-3">
                                    <button
                                        className="btn btn-primary btn-sl-sm me-2"
                                        type="button"
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
