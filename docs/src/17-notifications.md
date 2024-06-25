# Real-Time Chat Application

## Adding Notifications and Auto-Scroll to the Chat App

In this tutorial, we will enhance our chat application by adding a notification system using Socket.IO. This will enable users to receive real-time notifications for new messages, even when they are not actively viewing the chat. Additionally, we will implement an auto-scroll feature to ensure the latest messages are always visible.

### Step 1: Implementing Auto-Scroll in Chat Box

We will start by adding an auto-scroll feature to the chat box, ensuring that the latest messages are always in view.

1. **Update ChatBox Component:**

   ```javascript
   // client/src/components/Chat/ChatBox.jsx
   import React, { useRef, useEffect } from 'react';
   import { Stack } from 'react-bootstrap';
   import { useChatContext } from '../../context/ChatContext';

   const ChatBox = () => {
       const { messages, user } = useChatContext();
       const scrollRef = useRef();

       useEffect(() => {
           scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
       }, [messages]);

       return (
           <div className="chat-box">
               <Stack gap={2}>
                   {messages.map((message, index) => (
                       <div key={index} ref={scrollRef}>
                           <span>{message.text}</span>
                       </div>
                   ))}
               </Stack>
           </div>
       );
   };

   export default ChatBox;
   ```

### Step 2: Setting Up Notifications on the Server

We will update our Socket.IO server to handle notifications by emitting an event when a new message is sent.

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
               // Emit notification event
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

Next, we need to update our client-side code to handle the `getNotification` event and display notifications to users when they receive new messages.

1. **Update Chat Context to Handle Notifications:**

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

               // Listen for notifications
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

2. **Update the Main Chat Component to Display Notifications:**

   ```javascript
   // client/src/pages/Chat.jsx
   import React, { useContext } from 'react';
   import { Container, Stack } from 'react-bootstrap';
   import { ChatContext } from '../context/ChatContext';
   import UserCard from '../components/Chat/UserCard';
   import PotentialChats from '../components/Chat/PotentialChats';
   import ChatBox from '../components/Chat/ChatBox';

   const Chat = () => {
       const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat, notifications } = useContext(ChatContext);

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
               {notifications.length > 0 && (
                   <div className="notifications">
                       {notifications.map((notification, index) => (
                           <div key={index} className="notification">
                               New message from {notification.senderId}
                           </div>
                       ))}
                   </div>
               )}
           </Container>
       );
   };

   export default Chat;
   ```

### Step 4: Updating CSS for Notifications

Finally, we need to add some custom styles to `index.css` to display notifications properly.

3. **Update `index.css`:**

   ```css
   /* client/src/index.css */

   .notifications {
       position: fixed;
       top: 10px;
       right: 10px;
       background: #f8d7da;
       color: #721c24;
       padding: 10px;
       border: 1px solid #f5c6cb;
       border-radius: 8px;
       z-index: 1000;
   }

   .notification {
       margin-bottom: 10px;
       padding: 10px;
       border-radius: 8px;
       background: #f8d7da;
       color: #721c24;
       border: 1px solid #f5c6cb;
   }
    ```

### Conclusion

In this tutorial, we successfully added a notification system to our chat application using Socket.IO. This allows users to receive real-time notifications for new messages, enhancing the overall user experience. In the next tutorial, we will continue to refine our application and explore more advanced features. Stay tuned for more updates and improvements!