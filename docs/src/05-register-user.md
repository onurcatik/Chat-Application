# Real-Time Chat Application 

## Registering a User with Context API and Making HTTP Requests

In the previous episode, we integrated Context API to manage the state of our form inputs and created a function to handle the registration of a user using HTTP requests. Now, we will build on this and actually register a user by performing the HTTP request to our backend API endpoint.

### Setting Up Utility Functions

1. **Create Services Folder and File:**
   Create a new folder called `utils` inside the `src` directory. Inside this folder, create a file named `services.js`.

2. **Define Base URL and Post Request Function:**
   ```javascript
   // src/utils/services.js
   export const baseURL = 'http://localhost:5000/api';

   export const postRequest = async (url, body) => {
       const response = await fetch(`${baseURL}${url}`, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(body),
       });

       const data = await response.json();

       if (!response.ok) {
           const message = data.message || data;
           return { error: true, message };
       }

       return data;
   };
   ```

### Using the Post Request Function in AuthContext

1. **Update AuthContext:**
   ```javascript
   // src/context/AuthContext.jsx
   import React, { createContext, useState, useCallback } from 'react';
   import { postRequest, baseURL } from '../utils/services';

   export const AuthContext = createContext();

   export const AuthContextProvider = ({ children }) => {
       const [registerInfo, setRegisterInfo] = useState({
           name: '',
           email: '',
           password: '',
       });
       const [registerError, setRegisterError] = useState(null);
       const [isRegisterLoading, setIsRegisterLoading] = useState(false);
       const [user, setUser] = useState(null);

       const updateRegisterInfo = useCallback((info) => {
           setRegisterInfo((prevInfo) => ({
               ...prevInfo,
               ...info,
           }));
       }, []);

       const registerUser = useCallback(async (e) => {
           e.preventDefault();
           setIsRegisterLoading(true);
           setRegisterError(null);

           const response = await postRequest('/users/register', registerInfo);

           setIsRegisterLoading(false);

           if (response.error) {
               setRegisterError(response.message);
           } else {
               setUser(response);
               localStorage.setItem('user', JSON.stringify(response));
           }
       }, [registerInfo]);

       return (
           <AuthContext.Provider value={{ registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, user }}>
               {children}
           </AuthContext.Provider>
       );
   };
   ```

### Using Context API in Register Component

1. **Update Register Component:**
   ```javascript
   // src/pages/Register.jsx
   import React, { useContext } from 'react';
   import { Form, Button, Row, Col, Stack, Alert } from 'react-bootstrap';
   import { AuthContext } from '../context/AuthContext';

   const Register = () => {
       const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);

       const handleChange = (e) => {
           const { name, value } = e.target;
           updateRegisterInfo({ [name]: value });
       };

       return (
           <Row className="justify-content-md-center" style={{ height: '100vh', paddingTop: '10%' }}>
               <Col xs={12} md={6}>
                   <Stack gap={3}>
                       <h2 className="text-light">Register</h2>
                       <Form onSubmit={registerUser}>
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
                               {isRegisterLoading ? 'Creating your account...' : 'Register'}
                           </Button>
                       </Form>
                       {registerError && <Alert variant="danger">{registerError}</Alert>}
                   </Stack>
               </Col>
           </Row>
       );
   };

   export default Register;
   ```

### Running and Testing the Application

1. **Ensure Backend is Running:**
   Make sure your backend server is running. If not, navigate to your backend directory and start it using `nodemon` or your preferred method.
   ```bash
   cd server
   nodemon index.js
   ```

2. **Test Registration:**
   Open your browser and navigate to your React application. Fill out the registration form with valid data and submit it. You should see appropriate error messages if the input is invalid and a success message or redirection if the registration is successful.

### Summary

In this episode, we successfully created utility functions to handle HTTP requests, updated our AuthContext to include registration logic, and utilized the Context API in our Register component to handle form submissions. In the next episode, we will implement user login, manage authentication state, and protect certain routes to ensure only authenticated users can access them.