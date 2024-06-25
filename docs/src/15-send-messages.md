# Building a Real-Time Chat Application (Part 15)

## Integrating Socket.IO for Real-Time Messaging

In this tutorial, we will integrate Socket.IO to enable real-time messaging and notifications in our chat application. We will set up Socket.IO on both the server and client sides to allow bi-directional communication between them.

### Step 1: Setting Up Socket.IO on the Server

First, we need to set up the Socket.IO server. We will start by installing Socket.IO and then create a basic server that listens for connections and emits events.

1. **Install Socket.IO:**

   ```bash
   npm install socket.io
   ```

2. **Create the Socket.IO Server:**

   ```javascript
   // server/index.js
   const { Server } = require("socket.io");
   const io = new Server(3000, {
       cors: {
           origin: "http://localhost:3000", // Replace with your client URL
       },
   });

   let onlineUsers = [];

   io.on("connection", (socket) => {
       console.log("New connection:", socket.id);

       socket.on("addUser", (userId) => {
           if (!onlineUsers.some((user) => user.userId === userId)) {
               onlineUsers.push({ userId, socketId: socket.id });
           }
           io.emit("getUsers", onlineUsers);
       });

       socket.on("sendMessage", ({ senderId, receiverId, text }) => {
           const user = onlineUsers.find((user) => user.userId === receiverId);
           if (user) {
               io.to(user.socketId).emit("getMessage", {
                   senderId,
                   text,
               });
           }
       });

       socket.on("disconnect", () => {
           onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
           io.emit("getUsers", onlineUsers);
       });
   });

   console.log("Socket.IO server running on port 3000");
   ```

### Step 2: Setting Up Socket.IO on the Client

Next, we need to set up Socket.IO on the client side to connect to the server and handle events.

1. **Install Socket.IO Client:**

   ```bash
   npm install socket.io-client
   ```

2. **Update Chat Context to Handle Socket.IO:**

   ```javascript
   // client/src/context/ChatContext.jsx
   import React, { createContext, useState, useEffect, useCallback } from 'react';
   import { getRequest, postRequest } from '../services';
   import { baseURL } from '../services';
   import { io } from 'socket.io-client';

   export const ChatContext = createContext();

   export const ChatContextProvider = ({ children, user }) => {
       const [userChats, setUserChats] = useState(null);
       const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
       const [userChatsError, setUserChatsError] = useState(null);
       const [potentialChats, setPotentialChats] = useState([]);
       const [currentChat, setCurrentChat] = useState(null);
       const [messages, setMessages] = useState([]);
       const [isMessagesLoading, setIsMessagesLoading] = useState(false);
       const [messagesError, setMessagesError] = useState(null);
       const [socket, setSocket] = useState(null);
       const [onlineUsers, setOnlineUsers] = useState([]);

       useEffect(() => {
           const newSocket = io("http://localhost:3000");
           setSocket(newSocket);

           return () => newSocket.close();
       }, []);

       useEffect(() => {
           if (socket && user) {
               socket.emit("addUser", user._id);
               socket.on("getUsers", (users) => {
                   setOnlineUsers(users);
               });

               socket.on("getMessage", (data) => {
                   if (currentChat?.members.includes(data.senderId)) {
                       setMessages((prev) => [...prev, { senderId: data.senderId, text: data.text }]);
                   }
               });
           }
       }, [socket, user, currentChat]);

       useEffect(() => {
           const getUserChats = async () => {
               if (!user || !user._id) return;
               setIsUserChatsLoading(true);
               setUserChatsError(null);

               const response = await getRequest(`${baseURL}/chats/${user._id}`);
               if (response.error) {
                   setUserChatsError(response);
               } else {
                   setUserChats(response);
               }
               setIsUserChatsLoading(false);
           };
           getUserChats();
       }, [user]);

       useEffect(() => {
           const getUsers = async () => {
               const response = await getRequest(`${baseURL}/users`);
               if (response.error) {
                   console.error(response.error);
                   return;
               }

               const pChats = response.filter((u) => {
                   if (u._id === user._id) return false;
                   if (userChats?.some((chat) =>
                       chat.members.includes(u._id))) return false;
                   return true;
               });

               setPotentialChats(pChats);
           };

           if (userChats) {
               getUsers();
           }
       }, [userChats]);

       const createChat = useCallback(async (firstId, secondId) => {
           const response = await postRequest(`${baseURL}/chats`, {
               firstId,
               secondId,
           });

           if (!response.error) {
               setUserChats((prev) => [...prev, response]);
               setPotentialChats((prev) =>
                   prev.filter((u) => u._id !== secondId)
               );
           }
       }, []);

       const updateCurrentChat = useCallback((chat) => {
           setCurrentChat(chat);
       }, []);

       const sendMessage = useCallback(async (chatId, senderId, text) => {
           const response = await postRequest(`${baseURL}/messages`, {
               chatId,
               senderId,
               text,
           });

           if (!response.error) {
               setMessages((prev) => [...prev, response]);
               socket.emit("sendMessage", {
                   senderId,
                   receiverId: currentChat.members.find((id) => id !== senderId),
                   text,
               });
           }
       }, [currentChat, socket]);

       return (
           <ChatContext.Provider value={{
               userChats,
               isUserChatsLoading,
               userChatsError,
               potentialChats,
               createChat,
               updateCurrentChat,
               currentChat,
               messages,
               isMessagesLoading,
               messagesError,
               sendMessage,
               onlineUsers,
           }}>
               {children}
           </ChatContext.Provider>
       );
   };
   ```

### Step 3: Updating the Chat Component

We need to update the main chat component to handle sending and receiving messages in real-time.

3. **Update Chat Component:**

   ```javascript
   // client/src/pages/Chat.jsx
   import React, { useContext } from 'react';
   import { Container, Stack } from 'react-bootstrap';
   import { ChatContext } from '../context/ChatContext';
   import UserCard from '../components/Chat/UserCard';
   import PotentialChats from '../components/Chat/PotentialChats';
   import ChatBox from '../components/Chat/ChatBox';

   const Chat = () => {
       const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat } = useContext(ChatContext);

       if (isUserChatsLoading) {
           return <p>Loading chats...</p>;
       }

       if (userChatsError) {
           return <p>Error loading chats: {userChatsError.message}</p>;
       }

       return (
           <Container>
               <Stack direction="horizontal" gap={4}>
                   <Stack gap={3} className="user-chat-list">
                       {userChats?.map((chat, index) => (
                           <div key={index} onClick={() => updateCurrentChat(chat)}>
                               <UserCard chat={chat} />
                           </div>
                       ))}
                   </Stack>
                   <ChatBox />
               </Stack>
               <PotentialChats />
           </Container>
       );
   };

   export default Chat;
   ```

### Step 4: Creating the ChatBox Component

We need to create the `ChatBox` component to handle sending and receiving messages in real-time.

4. **ChatBox Component:**

   ```javascript
   // client/src/components/Chat/ChatBox.jsx
   import React, { useContext, useState } from 'react';
   import { Stack } from 'react-bootstrap';
   import { ChatContext } from '../../context/ChatContext';
   import { AuthContext } from '../../context/AuthContext';
   import useFetchRecipient from '../../hooks/useFetchRecipient';
   import moment from 'moment';

   const ChatBox = () => {
       const { currentChat, messages, isMessagesLoading, sendMessage } = useContext(ChatContext);
       const { user } = useContext(AuthContext);
       const [newMessage, setNewMessage] = useState("");

       const { recipientUser } = useFetchRecipient(currentChat, user);

       const handleSendMessage = () => {
           if (newMessage.trim()) {
               sendMessage(currentChat._id, user._id, newMessage);
               setNewMessage("");
           }
       };

       if (!recipientUser) {
           return (
               <p style={{ textAlign: 'center', width: '100%' }}>
                   No conversation selected yet.
               </p>
           );
       }

       if (isMessagesLoading) {
           return (
               <p style={{ textAlign: 'center', width: '100%' }}>
                   Loading chat...
               </p>
           );
       }

       return (
           <Stack gap={4

} className="chat-box">
               <div className="chat-header">
                   <strong>{recipientUser.name}</strong>
               </div>
               <Stack gap={3} className="messages">
                   {messages.map((message, index) => (
                       <Stack
                           key={index}
                           direction="horizontal"
                           className={`message ${message.senderId === user._id ? 'self' : ''}`}
                       >
                           <span>{message.text}</span>
                           <span className="message-footer">
                               {moment(message.createdAt).calendar()}
                           </span>
                       </Stack>
                   ))}
               </Stack>
               <div className="chat-input">
                   <input
                       type="text"
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder="Type a message..."
                   />
                   <button onClick={handleSendMessage}>Send</button>
               </div>
           </Stack>
       );
   };

   export default ChatBox;
   ```

### Step 5: Updating CSS for ChatBox

Finally, we need to add some custom styles to `index.css` to ensure our chat box and messages are displayed correctly.

5. **Update `index.css`:**

   ```css
   /* client/src/index.css */

   .chat-box {
       padding: 20px;
       border: 1px solid #ddd;
       border-radius: 8px;
       height: 85vh;
       overflow-y: auto;
   }

   .chat-header {
       font-size: 18px;
       font-weight: bold;
       margin-bottom: 20px;
   }

   .messages {
       flex-grow: 1;
       overflow-y: auto;
   }

   .message {
       padding: 10px;
       border-radius: 8px;
       background: #f1f1f1;
       margin-bottom: 10px;
       max-width: 60%;
   }

   .message.self {
       align-self: flex-end;
       background: #007bff;
       color: white;
   }

   .message-footer {
       font-size: 12px;
       color: #888;
   }

   .chat-input {
       display: flex;
       align-items: center;
   }

   .chat-input input {
       flex: 1;
       padding: 10px;
       border-radius: 8px;
       border: 1px solid #ddd;
       margin-right: 10px;
   }

   .chat-input button {
       padding: 10px 20px;
       border-radius: 8px;
       border: none;
       background: #007bff;
       color: white;
       cursor: pointer;
   }
   ```

### Conclusion

In this tutorial, we successfully integrated Socket.IO for real-time messaging in our chat application. We set up the server and client to handle connections and events, allowing us to send and receive messages instantly. In the next tutorial, we will add a notification system to notify users of new messages. Stay tuned for more updates and features in our chat application.