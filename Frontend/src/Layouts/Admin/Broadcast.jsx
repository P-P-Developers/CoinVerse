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

