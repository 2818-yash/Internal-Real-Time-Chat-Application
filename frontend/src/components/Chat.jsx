import React, { useEffect, useRef, useState } from "react";
import "../styles/chat.css";

function Chat({ me, other }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [toast, setToast] = useState("");

  const fileRef = useRef(null);
  const socketRef = useRef(null);

  // Ask notification permission once
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Load old messages
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/messages/")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          m =>
            (m.from === me && m.to === other) ||
            (m.from === other && m.to === me)
        );
        setMessages(filtered);
      });
  }, [me, other]);

  // WebSocket
  useEffect(() => {
    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    socketRef.current.onmessage = e => {
      const data = JSON.parse(e.data);

      const isMyChat =
        (data.from === me && data.to === other) ||
        (data.from === other && data.to === me);

      if (!isMyChat) return;

      // 🚫 IGNORE SELF ECHO
      if (data.from === me) return;

      setMessages(prev => [...prev, data]);

      // popup for receiver
      setToast(`New message from ${data.from}`);
      setTimeout(() => setToast(""), 3000);

      if (Notification.permission === "granted") {
        new Notification("New Chat Message", {
          body: data.message ? data.message : "📷 Image received",
        });
      }
    };

    return () => socketRef.current.close();
  }, [me, other]);

  // Send text
  const sendText = () => {
    if (!text.trim()) return;

    // ✅ sender UI update
    setMessages(prev => [
      ...prev,
      {
        from: me,
        to: other,
        message: text,
      },
    ]);

    socketRef.current.send(
      JSON.stringify({
        from: me,
        to: other,
        message: text,
      })
    );

    setText("");
  };

  // Send image
  const sendImage = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("from", me);
    formData.append("to", other);
    formData.append("image", file);

    const res = await fetch(
      "http://127.0.0.1:8000/api/upload-image/",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    // ✅ sender UI update
    setMessages(prev => [
      ...prev,
      {
        from: me,
        to: other,
        image: data.image,
      },
    ]);

    socketRef.current.send(
      JSON.stringify({
        from: me,
        to: other,
        image: data.image,
      })
    );
  };

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.from === me ? "me" : "other"}`}>
            <div className="name">{m.from}</div>

            {m.message && <div>{m.message}</div>}

            {m.image && (
              <img
                src={`http://127.0.0.1:8000${m.image}`}
                alt="sent"
                className="chat-image"
              />
            )}
          </div>
        ))}
      </div>

      <div className="input">
        <button
          className="img-btn"
          onClick={() => fileRef.current.click()}
        />

        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={sendImage}
        />

        <input
          value={text}
          placeholder="Type message..."
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendText()}
        />

        <button className="send-btn" onClick={sendText}>
          Send
        </button>
      </div>
    </>
  );
}

export default Chat;
