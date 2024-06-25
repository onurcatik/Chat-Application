# Building a Real-Time Chat Application (Part 17)

## Adding a Notification System with Socket.IO

In this tutorial, we will implement a notification system in our real-time chat application. This feature will allow users to receive notifications for new messages even if they are not actively viewing the chat. We will also enhance the chat interface with auto-scrolling to ensure users always see the latest messages without manual scrolling.

### Step 1: Implementing Auto-Scroll in the Chat Box

First, we will add auto-scroll functionality to our chat box to automatically scroll to the latest message.

1. **Update Chat Box Component:**

   ```javascript
   // client/src/components/Chat/ChatBox.jsx
   import React, { useEffect, useRef, useContext } from 'react';
   import { Stack } from 'react-bootstrap';
   import { ChatContext } from '../../context/ChatContext';

   const ChatBox = () => {
       const { messages } = useContext(ChatContext);
       const scrollRef = useRef();

       useEffect(() => {
           if (scrollRef.current) {
               scrollRef.current.scrollIntoView({ behavior: 'smooth' });
           }
       }, [messages]);

       return (
           <Stack>
               {messages.map((message, index) => (
                   <div key={index} ref={scrollRef}>
                       {/* Render message here */}
                   </div>
               ))}
           </Stack>
       );
   };

   export default ChatBox;
   ```

### Step 2: Sending Notifications to the Client

Next, we will update our Socket.IO server to send notifications to users when they receive new messages.

1. **Update the Socket.IO Server:**

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
               io.to(user.socketId).emit("getNotification", {
                   senderId,
                   text,
                   isRead: false,
                   date: new Date(),
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

### Step 3: Handling Notifications on the Client

We will update the client-side code to handle notifications and display them to the user.

1. **Update Chat Context to Handle Notifications:**

   ```javascript
   // client/src/context/ChatContext.jsx
   import React, { createContext, useState, useEffect, useCallback } from 'react';
   import { io } from 'socket.io-client';
   import { getRequest, postRequest } from '../services';
   import { baseURL } from '../services';

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
       const [notifications, setNotifications] = useState([]);

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

               socket.on("getNotification", (data) => {
                   setNotifications((prev) => [...prev, data]);
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
               notifications,
           }}>
               {children}
           </ChatContext.Provider>
       );
   };
   ```

2. **Update Notification Component:**

   ```javascript
   // client/src/components/Notification.jsx
   import React, { useContext, useState } from 'react';
   import { ChatContext } from '../context/ChatContext';
   import moment from 'moment';

   const Notification = () => {
       const { notifications, userChats, updateCurrentChat } = useContext(ChatContext);
       const [isOpen, setIsOpen] = useState(false);

       const handleNotificationClick = (notification) => {
           const chat = userChats.find((chat) =>
               chat.members.includes(notification.senderId)
           );
           updateCurrentChat(chat);
           setIsOpen(false);
       };

       return (
           <div className="notifications">
               <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                   <svg
                       xmlns="http://www.w3.org/2000/svg"
                       width="16"
                       height="16"
                       fill="currentColor"
                       className="bi bi-chat-dots"
                       viewBox="0 0 16 16"
                   >
                       <path d="M8 1a7 7 0 0 0-6.978 6.583A5.5 5.5 0 1 1 10.5 15c0-1.032-.25-2.014-.696-2.888C9.99 11.445 9.966 11.5 10 11.5a1.5 1.5 0 0 0 0-3c-.035 0-.057.054-.104.106C9.25 9.514 9 9.496 9 9.496V9c0-.276-.224-.5-.5-.5s-.5.224-.5

.5v.496s-.25.018-.396-.106A.5.5 0 1 0 7 8.5v-.5c0-.276.224-.5.5-.5s.5.224.5.5v.5c0 .276-.224.5-.5.5a1.5 1.5 0 0 0 0 3c.034 0 .057-.055.104-.106C6.25 11.514 6 11.496 6 11.496v.004s.25-.018.396.106A1.5 1.5 0 1 0 7 13.5c.552 0 1-.448 1-1 0-.035-.056-.057-.104-.104C7.986 12.75 7.964 12.75 8 12.75c.25 0 .456.054.5.106C8.75 12.514 9 12.496 9 12.496v-.004s-.25.018-.396-.106A1.5 1.5 0 1 0 10 13.5c.552 0 1-.448 1-1 0-.035-.056-.057-.104-.104C10.25 12.75 10 12.732 10 12.732s.25-.018.396.106C10.75 12.514 11 12.496 11 12.496V9.496c0 .275.225.5.5.5s.5-.225.5-.5v.496s.25-.018.396.106C11.75 10.486 12 10.5 12 10.5a1.5 1.5 0 0 0 0-3c-.035 0-.057.054-.104.106C11.25 7.514 11 7.496 11 7.496V9c0 .276-.224.5-.5.5s-.5-.224-.5-.5V6.496s.25-.018.396.106A.5.5 0 1 0 10 5.5v-.5c0-.276.224-.5.5-.5s.5.224.5.5v.5c0 .276-.224.5-.5.5A1.5 1.5 0 0 0 8 7c-.035 0-.057-.054-.104-.106C7.25 6.514 7 6.496 7 6.496v.004s.25-.018.396.106A1.5 1.5 0 1 0 8 7.5c.552 0 1-.448 1-1 0-.035-.056-.057-.104-.104C8.25 6.75 8 6.732 8 6.732s.25-.018.396.106C8.75 6.514 9 6.496 9 6.496V1.5a.5.5 0 0 0-.5-.5zm1 10.5v-1a1.5 1.5 0 1 1-3 0v1a1.5 1.5 0 1 1 3 0z" />
                   </svg>
                   {notifications.length > 0 && (
                       <span className="notification-count">
                           {notifications.length}
                       </span>
                   )}
               </div>
               {isOpen && (
                   <div className="notifications-box">
                       <div className="notifications-header">
                           <h3>Notifications</h3>
                           <div className="mark-as-read" onClick={() => setNotifications([])}>
                               Mark all as read
                           </div>
                       </div>
                       {notifications.length === 0 ? (
                           <span>No notifications yet</span>
                       ) : (
                           notifications.map((notification, index) => (
                               <div
                                   key={index}
                                   className={`notification ${notification.isRead ? 'read' : 'unread'}`}
                                   onClick={() => handleNotificationClick(notification)}
                               >
                                   <span>{notification.senderId} sent you a new message</span>
                                   <span className="notification-time">
                                       {moment(notification.date).fromNow()}
                                   </span>
                               </div>
                           ))
                       )}
                   </div>
               )}
           </div>
       );
   };

   export default Notification;
   ```

### Step 4: Updating CSS for Notifications

Finally, we need to add custom styles for the notifications to `index.css`.

3. **Update `index.css`:**

   ```css
   /* client/src/index.css */

   .notifications {
       position: relative;
   }

   .notifications-icon {
       cursor: pointer;
       position: relative;
   }

   .notification-count {
       background-color: red;
       color: white;
       border-radius: 50%;
       padding: 2px 6px;
       position: absolute;
       top: -5px;
       right: -10px;
   }

   .notifications-box {
       position: absolute;
       right: 0;
       top: 30px;
       background: white;
       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
       border-radius: 5px;
       width: 300px;
       z-index: 1000;
   }

   .notifications-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 10px;
       border-bottom: 1px solid #eee;
   }

   .notifications-header h3 {
       margin: 0;
   }

   .mark-as-read {
       cursor: pointer;
       color: blue;
   }

   .notification {
       padding: 10px;
       border-bottom: 1px solid #eee;
   }

   .notification.unread {
       background-color: #f8f8f8;
   }

   .notification-time {
       display: block;
       color: #999;
       font-size: 12px;
   }
   ```

### Conclusion

In this tutorial, we implemented a notification system in our real-time chat application using Socket.IO. Users can now receive notifications for new messages even when they are not actively viewing the chat. We also added auto-scroll functionality to the chat box to improve the user experience. Stay tuned for more tutorials and enhancements to this application!