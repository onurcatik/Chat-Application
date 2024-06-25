# Real-Time Chat Application

## Displaying Chat Messages in React

In this tutorial, we will extend our chat application by enabling the display of messages when a specific chat is selected. We will set up the state for the current chat, fetch the messages for the selected chat, and render those messages in the chat box. Let's dive into the details.

### Step 1: Updating Chat Context

We need to update our chat context to include state management for the current chat and to fetch messages for the selected chat.

1. **Update Chat Context:**

   ```javascript
   // client/src/context/ChatContext.jsx
   import React, { createContext, useState, useEffect, useCallback } from 'react';
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

       useEffect(() => {
           const getMessages = async () => {
               if (!currentChat) return;
               setIsMessagesLoading(true);
               setMessagesError(null);

               const response = await getRequest(`${baseURL}/messages/${currentChat._id}`);
               if (response.error) {
                   setMessagesError(response);
               } else {
                   setMessages(response);
               }
               setIsMessagesLoading(false);
           };
           getMessages();
       }, [currentChat]);

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
           }}>
               {children}
           </ChatContext.Provider>
       );
   };
   ```

### Step 2: Updating the Chat Component

Next, we need to update the main chat component to handle the selection of a chat and display its messages.

2. **Update Chat Component:**

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

### Step 3: Creating the ChatBox Component

We need to create the `ChatBox` component to display messages for the selected chat.

3. **ChatBox Component:**

   ```javascript
   // client/src/components/Chat/ChatBox.jsx
   import React, { useContext } from 'react';
   import { Stack } from 'react-bootstrap';
   import { ChatContext } from '../../context/ChatContext';
   import { AuthContext } from '../../context/AuthContext';
   import useFetchRecipient from '../../hooks/useFetchRecipient';
   import moment from 'moment';

   const ChatBox = () => {
       const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
       const { user } = useContext(AuthContext);

       const { recipientUser } = useFetchRecipient(currentChat, user);

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
           <Stack gap={4} className="chat-box">
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
           </Stack>
       );
   };

   export default ChatBox;
   ```

### Step 4: Updating CSS for ChatBox

Finally, we need to add some custom styles to `index.css` to ensure our chat box and messages are displayed correctly.

4. **Update `index.css`:**

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
   ```

### Conclusion

In this tutorial, we successfully added the functionality to display messages for a selected chat. We updated the chat context to manage the current chat and fetch messages for it, created the `ChatBox` component to display those messages, and added the necessary CSS styles for a better user interface.

Next, we will implement the functionality to send messages and save them to the database. This will further enhance our real-time chat application. Stay tuned for more updates and features in our chat application.