Internal Real-Time Chat Application
This project is a real-time internal chat application developed using React for the frontend and Django for the backend. WebSockets are used to enable instant communication between users, allowing real-time text messaging and image sharing.
Features
•	Real-time messaging using WebSockets
•	Send and receive images in chat
•	Private user-to-user chat
•	Persistent chat history
•	Responsive and modern user interface
•	Low-latency communication for internal use
Tech Stack
•	Frontend:
React, JavaScript, CSS
•	Backend:
Django, Django Channels, WebSockets
•	Database:
SQLite (can be replaced with other databases)
Project Structure
RECT_CHAT_APP/
├── backend/
│   ├── manage.py
│   └── django server files
├── frontend/
│   └── React application
└── README
How It Works
The backend uses Django Channels to manage WebSocket connections. The frontend React application establishes a WebSocket connection with the server to send and receive messages instantly. Images are uploaded and transmitted within the chat interface in real time.
Setup Instructions
1.	Clone the repository from GitHub
2.	Install backend dependencies using pip
3.	Run Django migrations
4.	Start the Django development server
5.	Install frontend dependencies using npm
6.	Start the React development server
Use Case
This application is suitable for internal team communication, learning real-time web development, and practicing full-stack development with React and Django.
Author
Developed as a full-stack learning and internal communication project.
