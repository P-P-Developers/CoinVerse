import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getUserdata } from "../../../Services/Superadmin/Superadmin";
import "./Chatbox.css";
import * as Config from "../../../Utils/Config";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Users = () => {
  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;
  const adminId = TokenData?.user_id;

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);

  const msgBodyRef = useRef(null);

  useEffect(() => {
    if (msgBodyRef.current) {
      msgBodyRef.current.scrollTop = msgBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    getAlluserdata();
  }, [search]);

  // get all admin
  const getAlluserdata = async () => {
    const data = { id: user_id };

    try {
      const response = await getUserdata(data);
      const result =
        response.data &&
        response.data.filter((item) => {
          return item.Role === "USER";
        });

      const filterusername =
        response.data &&
        response.data.filter((item) => {
          return item._id;
        });

      const searchfilter = result?.filter((item) => {
        const searchInputMatch =
          search == "" ||
          (item.FullName &&
            item.FullName.toLowerCase().includes(search.toLowerCase())) ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Email &&
            item.Email.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });

      setData(search ? searchfilter : result);
    } catch (error) {}
  };

  const fetchMessages = async (user) => {
    try {
      const convRes = await axios.post(`${Config.base_url}admin/conversation`, {
        userId: user._id,
        adminId,
      });

      const convId = convRes.data.conversation._id;
      setConversationId(convId);

      const res = await axios.get(`${Config.base_url}admin/messages/${convId}`);
      setMessages(res.data.messages);
    } catch (error) {}
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await axios.post(`${Config.base_url}admin/message`, {
        conversationId,
        senderId: adminId,
        receiverId: selectedUser._id,
        senderType: "admin",
        message: input,
      });
      setInput("");
      fetchMessages(selectedUser);
    } catch (error) {}
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="chat-container">
          <section className="message-area">
            <div className="chat-area">
              <div className="chatlist">
                <div className="">
                  <div className="">
                    <div className="chat-header">
                      <div className="msg-search">
                        <input
                          type="text"
                          className="form-control"
                          id="inlineFormInputGroup"
                          placeholder="Search"
                          aria-label="search"
                          onAbort={(e) => setSearch(e.target.value)}
                          onChange={(e) => setSearch(e.target.value)}
                          value={search}
                        />
                      </div>
                    </div>
                    <div className="">
                      {/* chat-list */}
                      <div className="chat-lists">
                        <div className="tab-content" id="myTabContent">
                          <div className="tab-pane fade show active" id="Open">
                            {/* chat-list */}
                            <div className="chat-list">
                              {data &&
                                data.map((userData, index) => (
                                  <a
                                    key={index}
                                    className="d-flex align-items-center mb-2"
                                    onClick={() => {
                                      setSelectedUser(userData);
                                      fetchMessages(userData);
                                    }} // 👈 Click se state set karo
                                  >
                                    <div className="flex-shrink-0">
                                      <img
                                        className="img-fluid"
                                        src={
                                          userData.image ||
                                          "https://avatar.iran.liara.run/public/4"
                                        }
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                        alt="user img"
                                      />
                                      <span className="active" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                      <h3>{`${userData.FullName}(${userData.UserName})`}</h3>
                                      <p>{userData.role}</p>
                                    </div>
                                  </a>
                                ))}
                            </div>
                           
                          </div>
                        </div>
                      </div>
                    
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser && (
                <div className="chatbox">
                  <div className="">
                    <div className="">
                      <div className="msg-head">
                        <div className="row">
                          <div className="col-8">
                            <div className="d-flex align-items-center">
                              <span className="chat-icon">
                                <img
                                  className="img-fluid"
                                  src="https://mehedihtml.com/chatbox/assets/img/arroleftt.svg"
                                  alt="image title"
                                />
                              </span>
                              <div className="flex-shrink-0">
                                <img
                                  className="img-fluid"
                                  src="https://avatar.iran.liara.run/public/4"
                                  alt="user img"
                                  style={{ width: "50px", height: "50px" }}
                                />
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h3>{selectedUser.UserName}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            {/* REFRESH BUTTON */}
                            <div className="d-flex justify-content-end">
                              <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => {
                                  fetchMessages(selectedUser);
                                }}
                              >
                                <i className="fa fa-refresh" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="msg-body" ref={msgBodyRef}>
                          <ul>
                            {messages.map((msg, idx) => {
                              return msg.senderType !== "admin" ? (
                                <li key={idx} className="sender">
                                  <p>{msg.message}</p>
                                  <span className="time">
                                    {formatTime(msg.timestamp)}
                                  </span>
                                </li>
                              ) : (
                                <li key={idx} className="repaly">
                                  <p>{msg.message}</p>
                                  <span className="time">
                                    {formatTime(msg.timestamp)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="send-box">
                        <form action="">
                          <input
                            type="text"
                            className="form-control"
                            aria-label="message…"
                            placeholder="Write message…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && sendMessage()
                            }
                          />

                          <button
                            type="button"
                            onClick={sendMessage}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault(); 
                                sendMessage();
                              }
                            }}
                          >
                            <i className="fa fa-paper-plane" /> Send
                          </button>
                        </form>
                        <div className="send-btns">
                          <div className="attach"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Users;
