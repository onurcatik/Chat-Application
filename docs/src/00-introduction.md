# Real-Time Chat Application

## Introduction

In this tutorial, we will develop a comprehensive real-time chat application using React, Node.js, and Socket.IO. The application will include features such as real-time messaging, real-time notifications, user authentication, and more. This guide aims to be thorough and precise, reflecting the rigor and standards expected in the field of software development.

### Technologies Used
- **React:** For building the user interface.
- **Node.js:** For the backend server.
- **Socket.IO:** For real-time communication.
- **Context API:** For state management in React.
- **JWT (JSON Web Tokens):** For authentication.

## Project Overview

The application will have the following features:
1. **User Registration and Authentication:** Users can register, log in, and log out.
2. **Real-Time Messaging:** Users can send and receive messages in real-time.
3. **Real-Time Notifications:** Users will receive notifications for new messages.
4. **Online Status Indication:** Users can see which contacts are online or offline.

## Setting Up the Development Environment

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Create React App CLI

### Initial Setup

1. **Create React Application:**
   ```bash
   npx create-react-app chat-app
   cd chat-app
   ```

2. **Setup Node.js Server:**
   ```bash
   mkdir server
   cd server
   npm init -y
   npm install express socket.io jsonwebtoken bcryptjs
   ```

## Backend Implementation

### Express Server Setup

Create an `index.js` file in the `server` directory with the following content:

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const users = []; // This should be replaced with a proper database

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
    res.status(201).json({ auth: true, token });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ auth: false, token: null });
    }
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ auth: true, token });
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
```

### Socket.IO Integration

Enhance the `index.js` file to handle real-time messaging:

```javascript
let onlineUsers = {};

io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        onlineUsers[userId] = socket.id;
        io.emit('userOnline', userId);
    });

    socket.on('message', ({ senderId, receiverId, message }) => {
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('message', { senderId, message });
        }
    });

    socket.on('disconnect', () => {
        for (let userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                io.emit('userOffline', userId);
                break;
            }
        }
    });
});
```

## Frontend Implementation

### Setting Up React Components

1. **Install Dependencies:**
   ```bash
   npm install socket.io-client jwt-decode
   ```

2. **Create Context for Auth and Socket:**
   ```javascript
   // src/context/AuthContext.js
   import React, { createContext, useState, useEffect } from 'react';
   import jwtDecode from 'jwt-decode';

   export const AuthContext = createContext();

   const AuthProvider = ({ children }) => {
       const [user, setUser] = useState(null);

       useEffect(() => {
           const token = localStorage.getItem('token');
           if (token) {
               const decoded = jwtDecode(token);
               setUser({ id: decoded.id });
           }
       }, []);

       const login = (token) => {
           localStorage.setItem('token', token);
           const decoded = jwtDecode(token);
           setUser({ id: decoded.id });
       };

       const logout = () => {
           localStorage.removeItem('token');
           setUser(null);
       };

       return (
           <AuthContext.Provider value={{ user, login, logout }}>
               {children}
           </AuthContext.Provider>
       );
   };

   export default AuthProvider;
   ```

3. **Socket Context:**
   ```javascript
   // src/context/SocketContext.js
   import React, { createContext, useContext, useEffect, useState } from 'react';
   import io from 'socket.io-client';
   import { AuthContext } from './AuthContext';

   export const SocketContext = createContext();

   const SocketProvider = ({ children }) => {
       const { user } = useContext(AuthContext);
       const [socket, setSocket] = useState(null);

       useEffect(() => {
           if (user) {
               const newSocket = io('http://localhost:5000');
               setSocket(newSocket);

               newSocket.emit('join', user.id);

               return () => newSocket.close();
           }
       }, [user]);

       return (
           <SocketContext.Provider value={socket}>
               {children}
           </SocketContext.Provider>
       );
   };

   export default SocketProvider;
   ```

4. **App Component:**
   ```javascript
   // src/App.js
   import React from 'react';
   import AuthProvider from './context/AuthContext';
   import SocketProvider from './context/SocketContext';
   import Chat from './components/Chat';
   import Login from './components/Login';

   const App = () => {
       return (
           <AuthProvider>
               <SocketProvider>
                   <div>
                       <Login />
                       <Chat />
                   </div>
               </SocketProvider>
           </AuthProvider>
       );
   };

   export default App;
   ```

5. **Login Component:**
   ```javascript
   // src/components/Login.js
   import React, { useState, useContext } from 'react';
   import { AuthContext } from '../context/AuthContext';

   const Login = () => {
       const [username, setUsername] = useState('');
       const [password, setPassword] = useState('');
       const { login } = useContext(AuthContext);

       const handleSubmit = async (e) => {
           e.preventDefault();
           const res = await fetch('http://localhost:5000/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ username, password }),
           });
           const data = await res.json();
           login(data.token);
       };

       return (
           <form onSubmit={handleSubmit}>
               <input
                   type="text"
                   placeholder="Username"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
               />
               <input
                   type="password"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
               />
               <button type="submit">Login</button>
           </form>
       );
   };

   export default Login;
   ```

6. **Chat Component:**
   ```javascript
   // src/components/Chat.js
   import React, { useContext, useEffect, useState } from 'react';
   import { SocketContext } from '../context/SocketContext';
   import { AuthContext } from '../context/AuthContext';

   const Chat = () => {
       const { user } = useContext(AuthContext);
       const socket = useContext(SocketContext);
       const [message, setMessage] = useState('');
       const [messages, setMessages] = useState([]);

       useEffect(() => {
           if (socket) {
               socket.on('message', (message) => {
                   setMessages((prevMessages) => [...prevMessages, message]);
               });
           }
       }, [socket]);

       const sendMessage = () => {
           if (socket && message) {
               socket.emit('message', { senderId: user.id, message });
               setMessage('');
           }
       };

       return (
           <div>
               <div>
                   {messages.map((msg, index) => (
                       <div key={index}>{msg.message}</div>
                   ))}
               </div>
               <input
                   type="text"
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
               />
               <button onClick={sendMessage}>Send</button>
           </div>
       );
   };

   export default Chat;
   ```