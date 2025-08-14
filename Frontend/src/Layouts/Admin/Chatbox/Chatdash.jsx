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

  // New states for notifications and unread messages
  const [unreadMessages, setUnreadMessages] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(true); // Track if window is visible

  const msgBodyRef = useRef(null);
  const audioRef = useRef(null);
  const pollingInterval = useRef(null);

  // Initialize audio for notification sound
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBSuTyfDIeSUIJHfJ8N2QQAoUXrTp66hVFApGn+DyvmEbBSuTyfDIeSUIJHfJ8N2QQAoUXrTp66hVFApGn+DyvmEbBSuTyfDIeSUIJHfJ8N2QQAoUXrTp66hVFApGn+DyvmEbBSuTyfDIeSwF";

    // Track window visibility to auto-clear notifications
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);

      // Clear unread messages for selected user when window becomes visible
      if (!document.hidden && selectedUser) {
        setUnreadMessages(prev => ({
          ...prev,
          [selectedUser._id]: 0
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedUser]);

  useEffect(() => {
    if (msgBodyRef.current) {
      msgBodyRef.current.scrollTop = msgBodyRef.current.scrollHeight;
    }

    // Clear unread messages when messages are loaded and user is viewing them
    if (selectedUser && messages.length > 0) {
      setUnreadMessages(prev => ({
        ...prev,
        [selectedUser._id]: 0
      }));
    }
  }, [messages, selectedUser]);

  useEffect(() => {
    getAlluserdata();
  }, [search]);

  // Re-sort users when unread messages or last messages change
  useEffect(() => {
    if (data.length > 0) {
      const sortedUsers = [...data].sort((a, b) => {
        const aUnread = unreadMessages[a._id] || 0;
        const bUnread = unreadMessages[b._id] || 0;

        // First priority: users with unread messages
        if (aUnread > 0 && bUnread === 0) return -1;
        if (bUnread > 0 && aUnread === 0) return 1;

        // Second priority: last message timestamp
        const aLastMsg = lastMessages[a._id];
        const bLastMsg = lastMessages[b._id];

        if (aLastMsg && bLastMsg) {
          return new Date(bLastMsg.timestamp) - new Date(aLastMsg.timestamp);
        }
        if (aLastMsg && !bLastMsg) return -1;
        if (bLastMsg && !aLastMsg) return 1;

        // Default: alphabetical by name
        return (a.FullName || a.UserName || '').localeCompare(b.FullName || b.UserName || '');
      });

      // Only update if order actually changed
      const hasOrderChanged = sortedUsers.some((user, index) =>
        !data[index] || user._id !== data[index]._id
      );

      if (hasOrderChanged) {
        setData(sortedUsers);
      }
    }
  }, [unreadMessages, lastMessages]);

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    if (selectedUser) {
      // Clear notifications immediately when a user is selected
      setUnreadMessages(prev => ({
        ...prev,
        [selectedUser._id]: 0
      }));

      pollingInterval.current = setInterval(() => {
        fetchMessages(selectedUser, true);
      }, 3000);

      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }
  }, [selectedUser]);

  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Show browser notification
  const showBrowserNotification = (userName, message) => {
    if (Notification.permission === 'granted') {
      new Notification(`New message from ${userName}`, {
        body: message.length > 50 ? message.substring(0, 50) + '...' : message,
        icon: '/favicon.ico',
        tag: 'chat-notification'
      });
    }
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Clear notifications when component mounts or messages change for selected user
  useEffect(() => {
    if (selectedUser) {
      const timer = setTimeout(() => {
        setUnreadMessages(prev => ({
          ...prev,
          [selectedUser._id]: 0
        }));
      }, 500); // Small delay to ensure messages are loaded

      return () => clearTimeout(timer);
    }
  }, [selectedUser, messages]);

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

      // Check for new messages for all users
      if (result) {
        result.forEach(user => checkForNewMessages(user));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Check for new messages for a specific user
  const checkForNewMessages = async (user) => {
    try {
      const convRes = await axios.post(`${Config.base_url}admin/conversation`, {
        userId: user._id,
        adminId,
      });

      const convId = convRes.data.conversation._id;
      const res = await axios.get(`${Config.base_url}admin/messages/${convId}`);
      const latestMessages = res.data.messages;

      if (latestMessages && latestMessages.length > 0) {
        const lastMessage = latestMessages[latestMessages.length - 1];
        const previousLastMessage = lastMessages[user._id];

        // If there's a new message from the user (not admin)
        if (lastMessage &&
          lastMessage.senderType !== 'admin' &&
          (!previousLastMessage || lastMessage._id !== previousLastMessage._id)) {

          // Update unread count if this user is not selected
          if (!selectedUser || selectedUser._id !== user._id) {
            setUnreadMessages(prev => ({
              ...prev,
              [user._id]: (prev[user._id] || 0) + 1
            }));

            // Play notification sound and show browser notification
            playNotificationSound();
            showBrowserNotification(user.UserName || user.FullName, lastMessage.message);

            // Move user to top of the list by updating their timestamp
            moveUserToTop(user._id);
          }

          // Update last message
          setLastMessages(prev => ({
            ...prev,
            [user._id]: lastMessage
          }));
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  };

  // Function to move user to top of list
  const moveUserToTop = (userId) => {
    setData(prevData => {
      const userIndex = prevData.findIndex(user => user._id === userId);
      if (userIndex > 0) { // If user is not already at top
        const userToMove = prevData[userIndex];
        const newData = [userToMove, ...prevData.filter((_, index) => index !== userIndex)];
        return newData;
      }
      return prevData;
    });
  };

  const fetchMessages = async (user, isPolling = false) => {
    try {
      const convRes = await axios.post(`${Config.base_url}admin/conversation`, {
        userId: user._id,
        adminId,
      });

      const convId = convRes.data.conversation._id;
      setConversationId(convId);

      const res = await axios.get(`${Config.base_url}admin/messages/${convId}`);
      const newMessages = res.data.messages;

      // If this is from polling and there are new messages, play sound
      if (isPolling && newMessages.length > messages.length) {
        const hasNewUserMessage = newMessages.some((msg, idx) =>
          idx >= messages.length && msg.senderType !== 'admin'
        );

        if (hasNewUserMessage && selectedUser && selectedUser._id !== user._id) {
          playNotificationSound();
        }
      }

      setMessages(newMessages);

      // Always clear unread messages for selected user (when viewing messages)
      setUnreadMessages(prev => ({
        ...prev,
        [user._id]: 0
      }));

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsTyping(true);

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
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getLastMessagePreview = (userId) => {
    const lastMsg = lastMessages[userId];
    if (!lastMsg) return "No messages yet";

    const preview = lastMsg.message.length > 30
      ? lastMsg.message.substring(0, 30) + "..."
      : lastMsg.message;

    const sender = lastMsg.senderType === 'admin' ? 'You: ' : '';
    return sender + preview;
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
                          onChange={(e) => setSearch(e.target.value)}
                          value={search}
                        />
                      </div>
                      <div className="notification-settings mt-2">
                        <label className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => setSoundEnabled(e.target.checked)}
                            className="me-2"
                          />
                          <small>Sound Notifications</small>
                        </label>
                      </div>
                    </div>
                    <div className="">
                      <div className="chat-lists">
                        <div className="tab-content" id="myTabContent">
                          <div className="tab-pane fade show active" id="Open">
                            <div className="chat-list">
                              {data &&
                                data.map((userData, index) => {
                                  const isSelected =
                                    selectedUser &&
                                    selectedUser._id === userData._id;

                                  const unreadCount = unreadMessages[userData._id] || 0;

                                  return (
                                    <a
                                      key={index}
                                      onClick={() => {
                                        setSelectedUser(userData);
                                        // Clear unread messages immediately when user clicks
                                        setUnreadMessages(prev => ({
                                          ...prev,
                                          [userData._id]: 0
                                        }));
                                        fetchMessages(userData);
                                      }}
                                      className={`d-flex align-items-center mb-2 p-2 cursor-pointer position-relative ${isSelected
                                        ? "bg-primary text-white"
                                        : unreadCount > 0
                                          ? "bg-light border-start border-primary border-3"
                                          : index === 0 && lastMessages[userData._id]
                                            ? "bg-light border-start border-success border-2"
                                            : ""
                                        }`}
                                      style={{
                                        transition: "all 0.3s ease",
                                        boxShadow: unreadCount > 0 && !isSelected
                                          ? "0 2px 8px rgba(0,123,255,0.15)"
                                          : "none"
                                      }}
                                    >
                                      <div className="flex-shrink-0 position-relative">
                                        <img
                                          className="img-fluid"
                                          src={
                                            userData.image ||
                                            "https://avatar.iran.liara.run/public/4"
                                          }
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            border: unreadCount > 0 ? "2px solid #007bff" : "2px solid transparent"
                                          }}
                                          alt="user img"
                                        />
                                        {unreadCount > 0 && (
                                          <span
                                            className="position-absolute translate-middle badge rounded-pill bg-danger"
                                            style={{
                                              top: "10px",
                                              right: "5px",
                                              fontSize: "0.7rem",
                                              minWidth: "20px",
                                              height: "20px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center"
                                            }}
                                          >
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                          <div>
                                            <h3 className={`m-0 ${unreadCount > 0 ? 'fw-bold' : ''}`}>
                                              {`${userData.FullName} (${userData.UserName})`}
                                            </h3>
                                            <p
                                              className={`m-0 ${isSelected ? 'text-light' : 'text-muted'} ${unreadCount > 0 ? 'fw-semibold' : ''}`}
                                              style={{ fontSize: "0.75rem" }}
                                            >
                                              {getLastMessagePreview(userData._id)}
                                            </p>
                                          </div>
                                          {lastMessages[userData._id] && (
                                            <small className={`${isSelected ? 'text-light' : 'text-muted'}`}>
                                              {formatTime(lastMessages[userData._id].timestamp)}
                                            </small>
                                          )}
                                        </div>
                                      </div>
                                      {unreadCount > 0 && !isSelected && (
                                        <div
                                          className="position-absolute"
                                          style={{
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: "#007bff",
                                            borderRadius: "50%",
                                            animation: "pulse 2s infinite"
                                          }}
                                        />
                                      )}
                                    </a>
                                  );
                                })}
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
                                <small className="text-muted">
                                  {isTyping ? "Sending message..." : "Online"}
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="d-flex justify-content-end align-items-center">
                              <span className="badge bg-success me-2">
                                {unreadMessages[selectedUser._id] || 0 === 0 ? "All seen" : `${unreadMessages[selectedUser._id]} unread`}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm me-2"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                title={soundEnabled ? "Disable Sound" : "Enable Sound"}
                              >
                                <i className={`fa ${soundEnabled ? 'fa-volume-up' : 'fa-volume-off'}`} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => {
                                  fetchMessages(selectedUser);
                                  // Clear unread messages when manually refreshing
                                  setUnreadMessages(prev => ({
                                    ...prev,
                                    [selectedUser._id]: 0
                                  }));
                                }}
                                title="Refresh Messages"
                              >
                                <i className="fa fa-refresh" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div
                          className="msg-body"
                          ref={msgBodyRef}
                          onScroll={() => {
                            // Clear notifications when user scrolls (indicating they're reading)
                            if (selectedUser) {
                              setUnreadMessages(prev => ({
                                ...prev,
                                [selectedUser._id]: 0
                              }));
                            }
                          }}
                          onClick={() => {
                            // Clear notifications when user clicks in message area
                            if (selectedUser) {
                              setUnreadMessages(prev => ({
                                ...prev,
                                [selectedUser._id]: 0
                              }));
                            }
                          }}
                        >
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
                                  {idx === messages.length - 1 && (
                                    <small className="text-muted ms-2">
                                      <i className="fa fa-check" />
                                    </small>
                                  )}
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
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            disabled={isTyping}
                          />

                          <button
                            type="button"
                            onClick={sendMessage}
                            disabled={isTyping || !input.trim()}
                          >
                            <i className={`fa ${isTyping ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} />
                            {isTyping ? 'Sending...' : 'Send'}
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

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            transform: translateY(-20px); 
            opacity: 0;
          }
          to { 
            transform: translateY(0); 
            opacity: 1;
          }
        }
        
        .chat-list a {
          text-decoration: none !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          animation: slideDown 0.3s ease-out;
        }
        
        .chat-list a:hover {
          background-color: rgba(0, 123, 255, 0.1) !important;
          transform: translateY(-1px);
        }
        
        .chat-list a:first-child {
          border-left: 3px solid #28a745 !important;
          box-shadow: 0 2px 12px rgba(40, 167, 69, 0.1);
        }
        
        .notification-settings {
          padding: 0 15px;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 10px;
        }
        
        .msg-head {
          border-bottom: 1px solid #e9ecef;
          padding: 15px;
          background: #f8f9fa;
        }
        
        .send-box button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .recently-active {
          position: relative;
        }
        
        .recently-active::before {
          content: "Recent";
          position: absolute;
          top: -5px;
          right: -5px;
          background: #28a745;
          color: white;
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 10px;
          z-index: 10;
        }
      `}</style>
    </>
  );
};

export default Users;