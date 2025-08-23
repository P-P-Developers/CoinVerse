import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Table from "../../../Utils/Table/Table";
import socket from "../../../Utils/socketClient";

import {
  AddResearch,
  getResearch,
  symbolholdoff,
  DeleteResearch,
  EditResearch,
  UpdatStatus,
} from "../../../Services/Admin/Addmin";

import { getUserFromToken } from "../../../Utils/TokenVerify";

const initialFormData = {
  researchType: "Crypto",
  coin: "",
  price: "",
  targetPrice: "",
  stopLoss: "",
  entryReason: "",
  note: "",
  status: "Open",
  type: "buy",
};

const formFields = [
  { label: "Entry Price", name: "price", type: "number" },
  { label: "Target Price", name: "targetPrice", type: "number" },
  { label: "Stop Loss", name: "stopLoss", type: "number" },
];

const Research = () => {
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [researchData, setResearchData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [Symbols, setSymbols] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [prevPrices, setPrevPrices] = useState({});
  const [livePrices, setLivePrices] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "coin" && value) {
      const selectedCoinPrice = livePrices[value.toLowerCase()];
      if (selectedCoinPrice) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          price: selectedCoinPrice
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };



  useEffect(() => {
    const handleData = (data) => {
      const symbol = data?.data?.ticker?.toLowerCase();
      const price = Number(data?.data?.Mid_Price);
      if (symbol && !isNaN(price)) {
        setPrevPrices(prev => ({
          ...prev,
          [symbol]: livePrices[symbol],
        }));
        setLivePrices(prev => ({
          ...prev,
          [symbol]: price.toFixed(4),
        }));
      }
    };

    socket.on("receive_data_forex", handleData);
    return () => socket.off("receive_data_forex", handleData);
  }, [livePrices]);

  const validatePrices = () => {
    const entryPrice = parseFloat(formData.price);
    const targetPrice = parseFloat(formData.targetPrice);
    const stopLoss = parseFloat(formData.stopLoss);

    if (!entryPrice || !targetPrice || !stopLoss) {
      return true;
    }

    if (formData.type === "buy") {
      if (targetPrice <= entryPrice) {
        toast.error("Target Price should be greater than Entry Price for buy orders.");
        return false;
      }
      if (stopLoss >= entryPrice) {
        toast.error("Stop Loss should be less than Entry Price for buy orders.");
        return false;
      }
    } else if (formData.type === "sell") {
      if (targetPrice >= entryPrice) {
        toast.error("Target Price should be less than Entry Price for sell orders.");
        return false;
      }
      if (stopLoss <= entryPrice) {
        toast.error("Stop Loss should be greater than Entry Price for sell orders.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coin) {
      toast.error("Please select a coin/pair.");
      return;
    }

    // Validate prices
    if (!validatePrices()) {
      return;
    }

    try {
      if (editMode) {
        const response = await EditResearch({ ...formData, id: editId });
        if (response.status) {
          toast.success("Research updated successfully!");
        } else {
          toast.error("Failed to update research.");
        }
      } else {
        const response = await AddResearch({ ...formData, user_id });
        if (response) {
          toast.success("Research added successfully!");
        } else {
          toast.error("Failed to add research.");
        }
      }

      setShowModal(false);
      setFormData(initialFormData);
      setEditMode(false);
      setRefresh(!refresh);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const response = await getResearch(user_id);
        if (response?.data) setResearchData(response.data);
      } catch (error) { }
    };

    const fetchSymbols = async () => {
      try {
        const response = await symbolholdoff(user_id);
        setSymbols(response?.data || []);
      } catch (error) { }
    };

    fetchSymbols();
    fetchResearchData();
  }, [user_id, refresh]);

  const handleEdit = (data) => {
    setFormData(data);
    setEditMode(true);
    setEditId(data._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirmDelete) {
      const DeleteResponse = await DeleteResearch({ id });
      if (DeleteResponse) {
        toast.success("Research deleted successfully!");
        setRefresh(!refresh);
      } else {
        toast.error("Failed to delete research. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (id, status) => {
    const confirmToggle = window.confirm(
      `Are you sure you want to ${status === "Open" ? "close" : "open"
      } this entry?`
    );
    if (confirmToggle) {
      const updatedStatus = status === "Open" ? "Close" : "Open";
      const response = await UpdatStatus({ id, status: updatedStatus });

      if (response.status) {
        toast.success(`Research ${updatedStatus}d successfully!`);
        setRefresh(!refresh);
      } else {
        toast.error("Failed to update research status. Please try again.");
      }
    }
  };

  let columns = [
    { Header: "Coin", accessor: "researchType" },
    { Header: "Type", accessor: "coin" },
    { Header: "Price", accessor: "price" },
    { Header: "Target", accessor: "targetPrice" },
    { Header: "Stop Loss", accessor: "stopLoss" },
    { Header: "Reason", accessor: "entryReason" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell }) => {
        const status = cell.value;
        const isOpen = status === "Open";

        return (
          <span
            style={{
              backgroundColor: isOpen ? "#d1fae5" : "#e5e7eb",
              color: isOpen ? "#065f46" : "#374151",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              display: "inline-block",
              minWidth: "70px",
              textAlign: "center",
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleEdit(row?.cell?.row)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.cell?.row?._id)}
          >
            Delete
          </Button>
          <Button
            variant="info"
            size="sm"
            onClick={() =>
              handleToggleStatus(row?.cell?.row?._id, row?.cell?.row?.status)
            }
          >
            {row?.cell?.row?.status === "Open" ? "Close" : "Open"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card transaction-table">
            <div className="container-fluid py-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title">📈 Trade Research</h4>

                <Button
                  onClick={() => {
                    setShowModal(true);
                    setFormData(initialFormData);
                    setEditMode(false);
                    setEditId(null);
                  }}
                  variant="primary"
                >
                  <FaPlusCircle className="me-2" /> Add Research
                </Button>
              </div>

              <div className="card w-100">
                <div className="card-body p-0">
                  <div
                    className="table-responsive"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Table
                      columns={columns}
                      data={researchData && researchData}
                      rowsPerPage={rowsPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              size="lg"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {editMode ? "Edit Research" : "Add Research"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Research Type</Form.Label>
                        <Form.Select
                          name="researchType"
                          value={formData.researchType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Crypto">Crypto</option>
                          <option value="Forex">Forex</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Coin/Pair</Form.Label>
                        <Form.Select
                          name="coin"
                          value={formData.coin}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Coin/Pair</option>
                          {Symbols.length > 0 ? (
                            Symbols.filter(
                              (symbol) =>
                                symbol?.exch_seg?.toLowerCase() ===
                                formData?.researchType?.toLowerCase()
                            ).map((symbol, index) => (
                              <option key={index} value={symbol.symbol}>
                                {symbol.symbol}

                              </option>
                            ))
                          ) : (
                            <option value="">No symbols available</option>
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    {formFields.map((field, idx) => (
                      <Col md={6} key={idx}>
                        <Form.Group>
                          <Form.Label>
                            {field.label}
                            {field.name === "price" && formData.coin && livePrices[formData.coin.toLowerCase()] && (
                              <span className="text-success ms-2">
                                (Live: {livePrices[formData.coin.toLowerCase()]})
                              </span>
                            )}
                          </Form.Label>
                          <Form.Control
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}

                          />
                        </Form.Group>
                      </Col>
                    ))}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          <option value="buy" style={{ color: "green" }}>Buy</option>
                          <option value="sell" style={{ color: "red" }}>Sell</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Entry Reason</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="entryReason"
                      value={formData.entryReason}
                      onChange={handleInputChange}
                      rows={2}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={2}
                      required
                    />
                  </Form.Group>

                  <div className="text-end">
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>{" "}
                    <Button variant="primary" type="submit">
                      {editMode ? "Update" : "Submit"}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Research;