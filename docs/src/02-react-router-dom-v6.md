# Real-Time Chat Application

## Setting Up React Router and Initial Pages

In this part of the tutorial, we will configure our React application to use React Router DOM for routing, allowing us to navigate between different pages such as the home page, login page, and registration page. We will also set up the basic structure of our React application using Vite.

### Prerequisites

Ensure you have Node.js and npm installed.

### Setting Up the Client-Side Environment

1. **Navigate to the Client Folder:**
   ```bash
   cd client
   ```

2. **Create React App Using Vite:**
   ```bash
   npm create vite@latest
   ```
   - When prompted, use `.` to create the project in the current folder.
   - Choose `React` and `JavaScript` as options.

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```
   Open the provided URL (usually `http://localhost:3000`) to see the default Vite React application.

### Clean Up the Initial Setup

1. **Remove Unnecessary Files:**
   - Delete `App.css`, `logo.svg`, and other unnecessary files in the `src` folder.
   - Clean up `App.jsx` and `index.css`.

2. **Update `App.jsx`:**
   ```javascript
   // src/App.jsx
   import React from 'react';

   function App() {
       return (
           <div>
               Chat App
           </div>
       );
   }

   export default App;
   ```

3. **Update `index.css`:**
   ```css
   /* src/index.css */
   /* Add your custom styles here */
   ```

### Install React Router DOM

Install React Router DOM to handle routing in the application:
```bash
npm install react-router-dom
```

### Setting Up Routing

1. **Create Folders for Pages and Components:**
   - Create `src/pages` and `src/components`.

2. **Create Page Components:**
   - `Chat.jsx`:
     ```javascript
     // src/pages/Chat.jsx
     import React from 'react';

     const Chat = () => {
         return (
             <div>Chat</div>
         );
     };

     export default Chat;
     ```

   - `Login.jsx`:
     ```javascript
     // src/pages/Login.jsx
     import React from 'react';

     const Login = () => {
         return (
             <div>Login</div>
         );
     };

     export default Login;
     ```

   - `Register.jsx`:
     ```javascript
     // src/pages/Register.jsx
     import React from 'react';

     const Register = () => {
         return (
             <div>Register</div>
         );
     };

     export default Register;
     ```

3. **Set Up Routes in `App.jsx`:**
   ```javascript
   // src/App.jsx
   import React from 'react';
   import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
   import Chat from './pages/Chat';
   import Login from './pages/Login';
   import Register from './pages/Register';

   function App() {
       return (
           <Router>
               <Routes>
                   <Route path="/" element={<Chat />} />
                   <Route path="/login" element={<Login />} />
                   <Route path="/register" element={<Register />} />
                   <Route path="*" element={<Navigate to="/" />} />
               </Routes>
           </Router>
       );
   }

   export default App;
   ```

4. **Wrap Application with Router in `main.jsx`:**
   ```javascript
   // src/main.jsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')).render(
       <React.StrictMode>
           <App />
       </React.StrictMode>
   );
   ```

### Verifying the Setup

1. **Run the Application:**
   ```bash
   npm run dev
   ```

2. **Test Navigation:**
   - Navigate to `/` to see the Chat component.
   - Navigate to `/login` to see the Login component.
   - Navigate to `/register` to see the Register component.
   - Navigate to a non-existent route (e.g., `/xyz`) to test the fallback route which should redirect to the home page.

### Next Steps

In the next episode, we will work on creating forms for user registration and login using Bootstrap. We will also handle the logic for submitting these forms and integrating them with our backend APIs.