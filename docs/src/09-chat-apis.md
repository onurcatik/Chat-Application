# Building a Real-Time Chat Application (Part 10)

## Creating Chat API Endpoints

In the last episode, we set up our chat model and created the necessary API endpoints to manage chat functionality, including creating a chat, getting user chats, and finding a specific chat. In this episode, we will create API endpoints to manage messages within our chat application. This includes creating messages and retrieving messages for specific chats.

### Setting Up the Message Model

First, let's create a model for our messages.

1. **Create Message Model:**
   ```javascript
   // server/models/Message.js
   const mongoose = require('mongoose');

   const messageSchema = new mongoose.Schema({
       chatId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Chat',
           required: true,
       },
       senderId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User',
           required: true,
       },
       text: {
           type: String,
           required: true,
       },
   }, { timestamps: true });

   const Message = mongoose.model('Message', messageSchema);

   module.exports = Message;
   ```

### Creating Message Controllers

Next, let's create a controller to handle message-related operations.

2. **Create Message Controller:**
   ```javascript
   // server/controllers/MessageController.js
   const Message = require('../models/Message');

   const createMessage = async (req, res) => {
       const { chatId, senderId, text } = req.body;

       try {
           const message = new Message({
               chatId,
               senderId,
               text,
           });

           const savedMessage = await message.save();
           res.status(200).json(savedMessage);
       } catch (error) {
           res.status(500).json(error);
       }
   };

   const getMessages = async (req, res) => {
       const { chatId } = req.params;

       try {
           const messages = await Message.find({ chatId });
           res.status(200).json(messages);
       } catch (error) {
           res.status(500).json(error);
       }
   };

   module.exports = {
       createMessage,
       getMessages,
   };
   ```

### Setting Up Message Routes

Now, we need to create routes to handle incoming requests for creating and retrieving messages.

3. **Create Message Routes:**
   ```javascript
   // server/routes/MessageRoute.js
   const router = require('express').Router();
   const { createMessage, getMessages } = require('../controllers/MessageController');

   router.post('/', createMessage);
   router.get('/:chatId', getMessages);

   module.exports = router;
   ```

### Integrating Message Routes into the Application

Finally, let's integrate these routes into our main application.

4. **Update Main Application:**
   ```javascript
   // server/index.js
   const express = require('express');
   const mongoose = require('mongoose');
   const userRoute = require('./routes/UserRoute');
   const chatRoute = require('./routes/ChatRoute');
   const messageRoute = require('./routes/MessageRoute');
   const app = express();
   const PORT = process.env.PORT || 5000;

   app.use(express.json());

   mongoose.connect('mongodb://localhost/chat', {
       useNewUrlParser: true,
       useUnifiedTopology: true,
   }).then(() => {
       console.log('Connected to MongoDB');
   }).catch((err) => {
       console.log(err);
   });

   app.use('/api/users', userRoute);
   app.use('/api/chats', chatRoute);
   app.use('/api/messages', messageRoute);

   app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
   });
   ```

### Testing the Message Endpoints

Now that we have set up our message model, controller, and routes, let's test the endpoints using Postman.

1. **Create a Message:**
   - Open Postman and create a new POST request to `http://localhost:5000/api/messages`.
   - In the body, select JSON and include the `chatId`, `senderId`, and `text` fields.
   - Click `Send` to create a new message.

2. **Retrieve Messages:**
   - Create a new GET request to `http://localhost:5000/api/messages/{chatId}` (replace `{chatId}` with a valid chat ID).
   - Click `Send` to retrieve all messages for the specified chat.

### Summary

In this episode, we created the necessary API endpoints to manage messages within our chat application. We set up a message model, created controllers to handle message creation and retrieval, and integrated these routes into our main application. In the next episode, we will integrate these message functionalities into our frontend and begin building the real-time chat interface.

Stay tuned for more detailed tutorials on building a robust real-time chat application.