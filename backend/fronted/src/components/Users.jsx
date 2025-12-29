import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/user.css";


function Users({ me, setChatUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/users/")
      .then(res => setUsers(res.data));
  }, []);

  return (
    <div className="users-bg">
      <div className="container">
        <div className="header">Hello, {me}</div>

        <div className="users">
          {users
            .filter(u => u.username !== me)
            .map(u => (
              <div
                key={u.username}
                className="user"
                onClick={() => setChatUser(u.username)}
              >
                <div className="avatar">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="name">{u.username}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Users;
