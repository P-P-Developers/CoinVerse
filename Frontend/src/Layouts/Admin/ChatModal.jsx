import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as Config from "../../Utils/Config";
import "./ChatModal.css"; // New external CSS file

const ChatModal = ({ user, adminId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user?._id) fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    try {
      const convRes = await axios.post(`${Config.base_url}admin/conversation`, {
        userId: user._id,
        adminId,
      });

      const convId = convRes.data.conversation._id;
      setConversationId(convId);

      const res = await axios.get(`${Config.base_url}admin/messages/${convId}`);
      setMessages(res.data.messages);

      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Fetch messages failed:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await axios.post(`${Config.base_url}admin/message`, {
        conversationId,
        senderId: adminId,
        receiverId: user._id,
        senderType: "admin",
        message: input,
      });
      setInput("");
      fetchMessages();
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };


  return (
    <div className="modal d-block" id="chat_modal" role="dialog">
      <div className="modal-dialog modal-dialog-scrollable modal-xl modal-dialog-centered">
        <div className="modal-content chat-modal-content">
          <div className="modal-header chat-modal-header">
            <h5 className="modal-title"><strong>{user?.FullName || "User"}</strong> <span className="badge bg-success ms-2">Online</span></h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body chat-modal-body">
            <div className="chat-message-list">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${msg.senderType === "admin" ? "chat-right" : "chat-left"}`}
                >
                  <div className="chat-bubble">
                    <p className="mb-1">{msg.message}</p>
                    <small className="text">{formatTime(msg.timestamp)}</small>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="modal-footer chat-modal-footer">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
