import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as Config from "../../Utils/Config";

const ChatModal = ({ user, adminId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      fetchMessages();
    }
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
      console.error("Failed to fetch messages:", error);
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
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="modal custom-modal d-block" id="chat_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div className="form-header modal-header-title text-start mb-0">
              <h4 className="mb-0">Chat</h4>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col h-[70vh]">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold">
                  Chat with {user?.name || "User"}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 px-1 scrollbar-thin">
                {messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.senderType === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.senderType === "admin"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
