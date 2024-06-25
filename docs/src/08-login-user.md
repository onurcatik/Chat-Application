# Building a Real-Time Chat Application (Part 9)

## Implementing User Login Functionality

In the last episode, we successfully implemented user logout functionality and conditionally rendered navigation links based on the user's authentication status. In this episode, we'll add user login functionality, including making HTTP requests to our backend, updating the user state, and storing user data in local storage.

### Adding Login Functionality in AuthContext

1. **Create Login Function:**
   ```javascript
   // src/context/AuthContext.jsx
   import React, { createContext, useState, useCallback, useEffect } from 'react';
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
       const [loginInfo, setLoginInfo] = useState({
           email: '',
           password: '',
       });
       const [loginError, setLoginError] = useState(null);
       const [isLoginLoading, setIsLoginLoading] = useState(false);
       const [user, setUser] = useState(null);

       useEffect(() => {
           const user = JSON.parse(localStorage.getItem('user'));
           if (user) {
               setUser(user);
           }
       }, []);

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

       const updateLoginInfo = useCallback((info) => {
           setLoginInfo((prevInfo) => ({
               ...prevInfo,
               ...info,
           }));
       }, []);

       const loginUser = useCallback(async (e) => {
           e.preventDefault();
           setIsLoginLoading(true);
           setLoginError(null);

           const response = await postRequest('/users/login', loginInfo);

           setIsLoginLoading(false);

           if (response.error) {
               setLoginError(response.message);
           } else {
               setUser(response);
               localStorage.setItem('user', JSON.stringify(response));
           }
       }, [loginInfo]);

       const logoutUser = useCallback(() => {
           localStorage.removeItem('user');
           setUser(null);
       }, []);

       return (
           <AuthContext.Provider value={{
               registerInfo,
               updateRegisterInfo,
               registerUser,
               registerError,
               isRegisterLoading,
               loginInfo,
               updateLoginInfo,
               loginUser,
               loginError,
               isLoginLoading,
               user,
               logoutUser,
           }}>
               {children}
           </AuthContext.Provider>
       );
   };
   ```

### Updating Login Component

1. **Update Login Form to Handle State and Submit:**
   ```javascript
   // src/pages/Login.jsx
   import React, { useContext } from 'react';
   import { Form, Button, Alert, Row, Col, Stack } from 'react-bootstrap';
   import { AuthContext } from '../context/AuthContext';

   const Login = () => {
       const {
           loginInfo,
           updateLoginInfo,
           loginUser,
           loginError,
           isLoginLoading,
       } = useContext(AuthContext);

       return (
           <Form onSubmit={loginUser}>
               <Row className="justify-content-md-center" style={{ height: '100vh', paddingTop: '10%' }}>
                   <Col xs={12} md={6}>
                       <Stack gap={3}>
                           <h2>Login</h2>
                           {loginError && <Alert variant="danger">{loginError.message}</Alert>}
                           <Form.Group controlId="formEmail">
                               <Form.Control
                                   type="email"
                                   placeholder="Email"
                                   value={loginInfo.email}
                                   onChange={(e) => updateLoginInfo({ email: e.target.value })}
                               />
                           </Form.Group>
                           <Form.Group controlId="formPassword">
                               <Form.Control
                                   type="password"
                                   placeholder="Password"
                                   value={loginInfo.password}
                                   onChange={(e) => updateLoginInfo({ password: e.target.value })}
                               />
                           </Form.Group>
                           <Button variant="primary" type="submit">
                               {isLoginLoading ? 'Getting you in...' : 'Login'}
                           </Button>
                       </Stack>
                   </Col>
               </Row>
           </Form>
       );
   };

   export default Login;
   ```

### Testing the Login Functionality

1. **Test Login:**
   - Start your application and try to log in with a user.
   - Verify that the user is logged in successfully and the state and local storage are updated accordingly.
   - Check for error handling by entering incorrect credentials.

### Summary

In this episode, we implemented the user login functionality by creating a `loginUser` function in the `AuthContext` and updating the `Login` component to handle state and form submission. This allows users to log in, updating the application state and local storage. In the next episode, we'll continue building our real-time chat application by creating APIs for managing messages.

Stay tuned for more detailed tutorials on building a robust real-time chat application.