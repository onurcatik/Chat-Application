# Real-Time Chat Application 

## Using Context API for State Management and Registering a User

In this part of the tutorial, we will focus on using Context API to manage the state of our form inputs and then make an HTTP request to register a user.

### Why Use Context API?

The Context API allows us to share data globally across our application without having to pass props through every level of our component tree. This makes it easier to manage and access data such as user information from any component within the application.

### Setting Up Context API

1. **Create Context Folder and File:**
   Create a new folder called `context` inside the `src` directory. Inside this folder, create a file named `AuthContext.jsx`.

2. **Create AuthContext:**
   ```javascript
   // src/context/AuthContext.jsx
   import React, { createContext, useState, useCallback } from 'react';

   export const AuthContext = createContext();

   export const AuthContextProvider = ({ children }) => {
       const [registerInfo, setRegisterInfo] = useState({
           name: '',
           email: '',
           password: '',
       });

       const updateRegisterInfo = useCallback((info) => {
           setRegisterInfo((prevInfo) => ({
               ...prevInfo,
               ...info,
           }));
       }, []);

       return (
           <AuthContext.Provider value={{ registerInfo, updateRegisterInfo }}>
               {children}
           </AuthContext.Provider>
       );
   };
   ```

3. **Wrap the Application with AuthContextProvider:**
   Update `main.jsx` to wrap the application with `AuthContextProvider`.
   ```javascript
   // src/main.jsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './index.css';
   import { AuthContextProvider } from './context/AuthContext';

   ReactDOM.createRoot(document.getElementById('root')).render(
       <React.StrictMode>
           <AuthContextProvider>
               <App />
           </AuthContextProvider>
       </React.StrictMode>
   );
   ```

### Using Context API in Register Component

1. **Update Register Component:**
   ```javascript
   // src/pages/Register.jsx
   import React, { useContext } from 'react';
   import { Form, Button, Row, Col, Stack, Alert } from 'react-bootstrap';
   import { AuthContext } from '../context/AuthContext';

   const Register = () => {
       const { registerInfo, updateRegisterInfo } = useContext(AuthContext);

       const handleChange = (e) => {
           const { name, value } = e.target;
           updateRegisterInfo({ [name]: value });
       };

       const handleSubmit = (e) => {
           e.preventDefault();
           // Make HTTP request to register user
       };

       return (
           <Row className="justify-content-md-center" style={{ height: '100vh', paddingTop: '10%' }}>
               <Col xs={12} md={6}>
                   <Stack gap={3}>
                       <h2 className="text-light">Register</h2>
                       <Form onSubmit={handleSubmit}>
                           <Form.Group controlId="formName">
                               <Form.Control
                                   type="text"
                                   placeholder="Name"
                                   name="name"
                                   value={registerInfo.name}
                                   onChange={handleChange}
                               />
                           </Form.Group>
                           <Form.Group controlId="formEmail">
                               <Form.Control
                                   type="email"
                                   placeholder="Email"
                                   name="email"
                                   value={registerInfo.email}
                                   onChange={handleChange}
                               />
                           </Form.Group>
                           <Form.Group controlId="formPassword">
                               <Form.Control
                                   type="password"
                                   placeholder="Password"
                                   name="password"
                                   value={registerInfo.password}
                                   onChange={handleChange}
                               />
                           </Form.Group>
                           <Button variant="primary" type="submit">
                               Register
                           </Button>
                       </Form>
                       <Alert variant="danger">
                           <p>An error occurred</p>
                       </Alert>
                   </Stack>
               </Col>
           </Row>
       );
   };

   export default Register;
   ```

### Making HTTP Request to Register a User

1. **Install Axios:**
   We will use Axios to make HTTP requests.
   ```bash
   npm install axios
   ```

2. **Create an Axios Instance:**
   Create a new file `api.js` in the `src` directory to configure Axios.
   ```javascript
   // src/api.js
   import axios from 'axios';

   const API = axios.create({
       baseURL: 'http://localhost:5000/api', // Replace with your backend URL
   });

   export default API;
   ```

3. **Update Register Component to Use Axios:**
   ```javascript
   // src/pages/Register.jsx
   import React, { useContext, useState } from 'react';
   import { Form, Button, Row, Col, Stack, Alert } from 'react-bootstrap';
   import { AuthContext } from '../context/AuthContext';
   import API from '../api';

   const Register = () => {
       const { registerInfo, updateRegisterInfo } = useContext(AuthContext);
       const [error, setError] = useState(null);

       const handleChange = (e) => {
           const { name, value } = e.target;
           updateRegisterInfo({ [name]: value });
       };

       const handleSubmit = async (e) => {
           e.preventDefault();
           try {
               const response = await API.post('/users/register', registerInfo);
               console.log(response.data); // Handle success (e.g., redirect to login)
           } catch (err) {
               setError(err.response.data.message || 'An error occurred');
           }
       };

       return (
           <Row className="justify-content-md-center" style={{ height: '100vh', paddingTop: '10%' }}>
               <Col xs={12} md={6}>
                   <Stack gap={3}>
                       <h2 className="text-light">Register</h2>
                       <Form onSubmit={handleSubmit}>
                           <Form.Group controlId="formName">
                               <Form.Control
                                   type="text"
                                   placeholder="Name"
                                   name="name"
                                   value={registerInfo.name}
                                   onChange={handleChange}
                               />
                           </Form.Group>
                           <Form.Group controlId="formEmail">
                               <Form.Control
                                   type="email"
                                   placeholder="Email"
                                   name="email"
                                   value={registerInfo.email}
                                   onChange={handleChange}
                               />
                           </Form.Group>
                           <Form.Group controlId="formPassword">
                               <Form.Control
                                   type="password"
                                   placeholder="Password"
                                   name="password"
                                   value={registerInfo.password}
                                   onChange={handleChange}
                               />
                           </Form.Group>
                           <Button variant="primary" type="submit">
                               Register
                           </Button>
                       </Form>
                       {error && <Alert variant="danger">{error}</Alert>}
                   </Stack>
               </Col>
           </Row>
       );
   };

   export default Register;
   ```

### Summary

In this episode, we integrated Context API to manage the state of our registration form. We used Axios to make an HTTP request to register a user. In the next episode, we will handle user login and authentication, manage the authentication state, and protect certain routes to ensure only authenticated users can access them.

Stay tuned for more detailed tutorials on building a robust real-time chat application.