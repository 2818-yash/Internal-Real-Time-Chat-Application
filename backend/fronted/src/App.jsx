import React, { useState } from "react";
import ChatWidget from "./components/ChatWidget";
import "./styles/chatbot.css"; // make sure this CSS is imported

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔵 FLOATING CHAT BOT BUTTON */}
      <div
        className="chat-fab"
        onClick={() => setOpen(true)}
      />

      {/* 🟣 CHAT WIDGET POPUP */}
      {open && (
        <ChatWidget
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default App;
