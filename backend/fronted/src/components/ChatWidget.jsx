import React, { useEffect, useState } from "react";
import axios from "axios";
import Chat from "./Chat";
import "../styles/chatbot.css";

function ChatWidget({ onClose }) {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState("");
  const [chatUser, setChatUser] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* =======================
     STEP 1: SELECT YOURSELF
     ======================= */  
  if (!me) {
    return (
      <div className="chat-widget">
        <div className="chat-header">
          Select Yourself
          <span className="close" onClick={onClose}>×</span>
        </div>

        <div className="chat-body user-grid">
          {users.map((u) => (
            <div
              key={u.username}
              className="user-card"
              onClick={() => setMe(u.username)}
            >
              <div className="user-avatar">
                {u.username[0].toUpperCase()}
              </div>
              <div className="user-name">
                {u.username}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     STEP 2: SELECT CHAT USER
     ========================= */
  if (!chatUser) {
    return (
      <div className="chat-widget">
        <div className="chat-header">
          Chat as {me}
          <span className="close" onClick={onClose}>×</span>
        </div>

        <div className="chat-body user-grid">
          {users
            .filter((u) => u.username !== me)
            .map((u) => (
              <div
                key={u.username}
                className="user-card"
                onClick={() => setChatUser(u.username)}
              >
                <div className="user-avatar">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="user-name">
                  {u.username}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  /* =====================
     STEP 3: CHAT SCREEN
     ===================== */
  return (
    <div className="chat-widget">
      <div className="chat-header">
        {me} Chat To {chatUser}
        <span className="close" onClick={() => setChatUser("")}> Back </span>
      </div>

      <Chat me={me} other={chatUser} />
    </div>
  );
}

export default ChatWidget;
