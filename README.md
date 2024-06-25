# Real-Time Chat Application

This repository contains the source code for a real-time chat application built using React, Node.js, and Socket.IO. The application supports real-time messaging and notifications, allowing users to see messages and notifications instantly without refreshing the page.

## Features

- **Real-Time Messaging:** Send and receive messages in real-time using Socket.IO.
- **User Online Status:** View which users are currently online.
- **Notifications:** Receive real-time notifications for new messages.
- **Auto-Scroll:** Automatically scrolls to the latest message in the chat box.
- **Responsive Design:** Ensures a great user experience on both desktop and mobile devices.

## Getting Started

Follow the instructions below to set up and run the project on your local machine.

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/real-time-chat-app.git
   cd real-time-chat-app
   ```

2. **Install server dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**

   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Socket.IO server:**

   ```bash
   cd server
   node index.js
   ```

2. **Start the React client:**

   ```bash
   cd ../client
   npm start
   ```

   The application should now be running at `http://localhost:3000`.

## Project Structure

```
real-time-chat-app/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Chat/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── ...
├── server/
│   ├── index.js
│   ├── package.json
│   └── ...
└── README.md
```

## Detailed Implementation

### Auto-Scroll Feature

Implemented in `ChatBox.jsx`, the auto-scroll feature uses `useRef` and `useEffect` hooks to automatically scroll to the latest message.

### Real-Time Messaging and Notifications

Socket.IO is used for real-time communication between the client and server. When a message is sent, it is emitted to the server, which then emits it to the intended recipient. Notifications are also emitted to inform users of new messages.

### Notification Handling

The client listens for `getNotification` events from the server. When a notification is received, it is added to the state and displayed in the UI. Users can mark notifications as read, and unread notifications are counted and displayed.

### CSS Styling

Custom styles for notifications and other UI elements are added in `index.css` to enhance the visual appearance of the application.

## Future Enhancements

- **Database Integration:** Save notifications and messages in a database.
- **Group Chats:** Enable group chat functionality.
- **Message Reactions:** Allow users to react to messages.
- **File Sharing:** Support for file sharing within chats.
- **Deployment:** Guide on deploying the application to a production environment.
