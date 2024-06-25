## Building a Real-Time Chat Application (Part 11)

### Consuming Chat and Message APIs in React

In the previous tutorials, we implemented the backend API endpoints for managing chats and messages. Now, we will integrate these APIs into our React frontend to enable chat functionality. This tutorial will cover the following:

1. Creating utility functions to perform GET requests.
2. Setting up context for managing chat state.
3. Fetching user-specific chats from the backend.
4. Displaying chat details on the frontend.

### Setting Up Utility Functions for GET Requests

First, we need to extend our utility functions to include GET requests. These functions will handle fetching data from our backend APIs.

1. **Extend the Utility Functions:**

   ```javascript
   // client/src/services/index.js
   export const getRequest = async (url) => {
       try {
           const response = await fetch(url);
           const data = await response.json();

           if (!response.ok) {
               const message = data.message || 'An error occurred';
               throw new Error(message);
           }

           return data;
       } catch (error) {
           return { error: true, message: error.message };
       }
   };
   ```

### Setting Up Chat Context

Next, we will create a new context to manage chat state within our React application. This context will handle fetching user-specific chats and storing them in state.

2. **Create Chat Context:**

   ```javascript
   // client/src/context/ChatContext.jsx
   import React, { createContext, useState, useEffect } from 'react';
   import { getRequest } from '../services';
   import { baseURL } from '../services';

   export const ChatContext = createContext();

   export const ChatContextProvider = ({ children, user }) => {
       const [userChats, setUserChats] = useState(null);
       const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
       const [userChatsError, setUserChatsError] = useState(null);

       useEffect(() => {
           const fetchUserChats = async () => {
               if (user && user._id) {
                   setIsUserChatsLoading(true);
                   setUserChatsError(null);

                   const response = await getRequest(`${baseURL}/chats/${user._id}`);

                   setIsUserChatsLoading(false);
                   if (response.error) {
                       setUserChatsError(response);
                   } else {
                       setUserChats(response);
                   }
               }
           };

           fetchUserChats();
       }, [user]);

       return (
           <ChatContext.Provider value={{ userChats, isUserChatsLoading, userChatsError }}>
               {children}
           </ChatContext.Provider>
       );
   };
   ```

### Integrating Chat Context into the Application

Now that we have our chat context, we need to integrate it into our application. This involves wrapping our main app component with the `ChatContextProvider` and passing the current user as a prop.

3. **Integrate Chat Context into the App:**

   ```javascript
   // client/src/App.jsx
   import React, { useContext } from 'react';
   import { AuthContext } from './context/AuthContext';
   import { ChatContextProvider } from './context/ChatContext';

   const App = () => {
       const { user } = useContext(AuthContext);

       return (
           <ChatContextProvider user={user}>
               {/* Your app components go here */}
           </ChatContextProvider>
       );
   };

   export default App;
   ```

### Fetching and Displaying User Chats

With the context set up, we can now fetch and display user-specific chats. We'll update the chat component to retrieve chats from the context and render them.

4. **Update Chat Component:**

   ```javascript
   // client/src/pages/Chat.jsx
   import React, { useContext } from 'react';
   import { ChatContext } from '../context/ChatContext';

   const Chat = () => {
       const { userChats, isUserChatsLoading, userChatsError } = useContext(ChatContext);

       if (isUserChatsLoading) {
           return <div>Loading chats...</div>;
       }

       if (userChatsError) {
           return <div>Error loading chats: {userChatsError.message}</div>;
       }

       return (
           <div>
               {userChats && userChats.length > 0 ? (
                   userChats.map((chat) => (
                       <div key={chat._id}>
                           <p>Chat with user ID: {chat.members.filter(member => member !== user._id)}</p>
                       </div>
                   ))
               ) : (
                   <p>No chats available</p>
               )}
           </div>
       );
   };

   export default Chat;
   ```

### Summary

In this tutorial, we integrated our chat and message APIs into the React frontend. We created utility functions for performing GET requests, set up a context to manage chat state, and updated the chat component to fetch and display user-specific chats. This setup lays the foundation for building a robust and interactive chat application.

In the next tutorial, we will further enhance the chat functionality by implementing message sending and real-time updates using Socket.IO. This will allow us to provide a seamless and responsive user experience.

Stay tuned for the next part, where we will dive deeper into real-time communication in our chat application.