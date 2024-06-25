# Real-Time Chat Application

## Creating and Listing User Chats in React

In this part of the tutorial, we will focus on the ability to create a new chat when clicking on a user from the list of potential chats. This functionality will involve updating the chat context and making a POST request to our backend API to create the chat. Let's dive into the details.

## Step 1: Updating Chat Context for Potential Chats

We need to update our chat context to include functionality for handling potential chats. This includes fetching all users and filtering them to exclude the currently logged-in user and users with whom we already have a chat.

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

       return (
           <ChatContext.Provider value={{ userChats, isUserChatsLoading, userChatsError, potentialChats, createChat }}>
               {children}
           </ChatContext.Provider>
       );
   };
   ```

## Step 2: Creating the Potential Chats Component

We need a component to list potential users for starting new chats. This component will use the `ChatContext` to fetch and display potential chat users.

2. **PotentialChats Component:**

   ```javascript
   // client/src/components/Chat/PotentialChats.jsx
   import React, { useContext } from 'react';
   import { ChatContext } from '../../context/ChatContext';
   import { AuthContext } from '../../context/AuthContext';

   const PotentialChats = () => {
       const { potentialChats, createChat } = useContext(ChatContext);
       const { user } = useContext(AuthContext);

       return (
           <div className="all-users">
               {potentialChats.map((u, index) => (
                   <div
                       key={index}
                       className="single-user"
                       onClick={() => createChat(user._id, u._id)}
                   >
                       {u.name}
                       <span className="user-online"></span>
                   </div>
               ))}
           </div>
       );
   };

   export default PotentialChats;
   ```

## Step 3: Integrating Potential Chats into the Main Chat Component

Finally, we need to integrate the `PotentialChats` component into our main chat page so that it displays alongside the existing chats.

3. **Update Chat Component:**

   ```javascript
   // client/src/pages/Chat.jsx
   import React, { useContext } from 'react';
   import { Container, Stack } from 'react-bootstrap';
   import { ChatContext } from '../context/ChatContext';
   import UserCard from '../components/Chat/UserCard';
   import PotentialChats from '../components/Chat/PotentialChats';

   const Chat = () => {
       const { userChats, isUserChatsLoading, userChatsError } = useContext(ChatContext);

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
                           <UserCard key={index} chat={chat} />
                       ))}
                   </Stack>
                   <div className="chat-box">Chat box here</div>
               </Stack>
               <PotentialChats />
           </Container>
       );
   };

   export default Chat;
   ```

## Conclusion

In this tutorial, we enhanced our chat application by implementing the ability to create new chats with users who are not already in the chat list. We added the necessary state management and API calls to handle fetching users, filtering out the current user and already existing chat users, and creating new chats.

Next, we will focus on fetching messages for a selected chat and displaying them in the chat box. This will further enhance the real-time communication capabilities of our application. Stay tuned for more updates and features in our chat application.