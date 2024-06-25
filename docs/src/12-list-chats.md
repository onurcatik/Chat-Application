# Real-Time Chat Application

## Styling and Listing User Chats in React

In the previous tutorial, we set up our React application to fetch user-specific chats from the backend. Now, we will focus on styling and displaying these chats using React Bootstrap and custom CSS. We will create a user-friendly interface to list the chats and prepare for future features such as creating new chats and sending messages.

## Step 1: Setting Up CSS and Bootstrap

To style our chat list, we will use a combination of custom CSS and Bootstrap classes. For this tutorial, I will provide the necessary CSS code, but you can download it from the link provided in the description for detailed customization.

1. **Add Custom CSS:**

   Copy the provided CSS styles into your `index.css` file. This includes styles for the chat container, user cards, and other elements.

   ```css
   /* index.css */
   body {
       background-color: #f8f9fa;
   }

   .user-card {
       display: flex;
       align-items: center;
       padding: 10px;
       border: 1px solid #ddd;
       border-radius: 4px;
       margin-bottom: 10px;
       background-color: #fff;
       cursor: pointer;
       transition: background-color 0.3s ease;
   }

   .user-card:hover {
       background-color: #f1f1f1;
   }

   .online-status {
       width: 10px;
       height: 10px;
       border-radius: 50%;
       background-color: #28a745;
       margin-left: 10px;
   }

   .user-card .avatar {
       height: 50px;
       width: 50px;
       border-radius: 50%;
       margin-right: 15px;
   }
   ```

## Step 2: Setting Up the Chat Component

We will now set up our chat component to display a list of user chats. This involves fetching the chat data from the context and rendering it in a styled format.

2. **Chat Component:**

   ```javascript
   // client/src/pages/Chat.jsx
   import React, { useContext } from 'react';
   import { ChatContext } from '../context/ChatContext';
   import Container from 'react-bootstrap/Container';
   import Stack from 'react-bootstrap/Stack';
   import UserCard from '../components/Chat/UserCard';

   const Chat = () => {
       const { userChats, isUserChatsLoading, userChatsError } = useContext(ChatContext);

       if (isUserChatsLoading) {
           return <p>Loading chats...</p>;
       }

       if (userChatsError) {
           return <p>Error loading chats: {userChatsError.message}</p>;
       }

       if (!userChats || userChats.length === 0) {
           return <p>No chats available</p>;
       }

       return (
           <Container>
               <Stack direction="horizontal" gap={4}>
                   <Stack gap={3} className="user-chat-list">
                       {userChats.map((chat, index) => (
                           <UserCard key={index} chat={chat} />
                       ))}
                   </Stack>
                   <div className="chat-box">Chat box here</div>
               </Stack>
           </Container>
       );
   };

   export default Chat;
   ```

## Step 3: Creating the UserCard Component

The `UserCard` component will display individual user chat details such as the avatar, user name, and last message. It will also include some basic styling.

3. **UserCard Component:**

   ```javascript
   // client/src/components/Chat/UserCard.jsx
   import React, { useContext } from 'react';
   import { AuthContext } from '../../context/AuthContext';
   import { useFetchRecipient } from '../../hooks/useFetchRecipient';
   import Avatar from '../../assets/avatar.svg'; // Assuming you saved the SVG as described

   const UserCard = ({ chat }) => {
       const { user } = useContext(AuthContext);
       const recipientUser = useFetchRecipient(chat, user);

       return (
           <div className="user-card">
               <img src={Avatar} alt="avatar" className="avatar" />
               <div>
                   <div className="name">{recipientUser?.name || 'Unknown User'}</div>
                   <div className="text">Last message here...</div>
               </div>
               <div className="online-status"></div>
           </div>
       );
   };

   export default UserCard;
   ```

## Step 4: Creating a Custom Hook to Fetch Recipient Data

We need a custom hook to fetch the recipient's data for each chat. This hook will identify the recipient based on the chat's member IDs and fetch their details from the backend.

4. **Custom Hook:**

   ```javascript
   // client/src/hooks/useFetchRecipient.js
   import { useState, useEffect } from 'react';
   import { getRequest } from '../services';
   import { baseURL } from '../services';

   export const useFetchRecipient = (chat, user) => {
       const [recipientUser, setRecipientUser] = useState(null);

       useEffect(() => {
           const fetchRecipient = async () => {
               const recipientID = chat.members.find((id) => id !== user._id);
               if (!recipientID) return;

               const response = await getRequest(`${baseURL}/users/find/${recipientID}`);
               if (!response.error) {
                   setRecipientUser(response);
               }
           };

           fetchRecipient();
       }, [chat, user]);

       return recipientUser;
   };
   ```

## Conclusion

In this tutorial, we focused on fetching and displaying user chats in our React application. We set up custom CSS for styling, created a `UserCard` component to display chat details, and developed a custom hook to fetch recipient data. This setup will make it easier to expand the chat functionality and provide a seamless user experience.

In the next tutorial, we will add the functionality to create new chats and handle chat messages. This will involve updating our backend APIs and enhancing the frontend to support real-time messaging with Socket.IO. Stay tuned for more advanced features and improvements in our chat application.