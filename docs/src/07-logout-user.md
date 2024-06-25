# Real-Time Chat Application

## Implementing Logout Functionality

In the last episode, we conditionally rendered our routes based on the user's authentication status. Now, we will implement the logout functionality, allowing users to log out, clearing the state and local storage.

### Adding Logout Functionality in AuthContext

1. **Create Logout Function:**
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

       const logoutUser = useCallback(() => {
           localStorage.removeItem('user');
           setUser(null);
       }, []);

       return (
           <AuthContext.Provider value={{ registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, user, logoutUser }}>
               {children}
           </AuthContext.Provider>
       );
   };
   ```

### Updating Navbar Component to Include Logout

1. **Update Navbar to Show Logout Link:**
   ```javascript
   // src/components/Navbar.jsx
   import React, { useContext } from 'react';
   import { Container, Nav, Navbar as BootstrapNavbar, Stack } from 'react-bootstrap';
   import { Link } from 'react-router-dom';
   import { AuthContext } from '../context/AuthContext';

   const Navbar = () => {
       const { user, logoutUser } = useContext(AuthContext);

       return (
           <BootstrapNavbar bg="dark" variant="dark" className="mb-4" style={{ height: '3.75rem' }}>
               <Container>
                   <BootstrapNavbar.Brand as={Link} to="/">Chat App</BootstrapNavbar.Brand>
                   <Nav className="ms-auto">
                       {user ? (
                           <Stack direction="horizontal" gap={3}>
                               <span className="text-warning">Logged in as {user.name}</span>
                               <Nav.Link as={Link} to="/login" onClick={logoutUser}>Logout</Nav.Link>
                           </Stack>
                       ) : (
                           <Stack direction="horizontal" gap={3}>
                               <Nav.Link as={Link} to="/login">Login</Nav.Link>
                               <Nav.Link as={Link} to="/register">Register</Nav.Link>
                           </Stack>
                       )}
                   </Nav>
               </Container>
           </BootstrapNavbar>
       );
   };

   export default Navbar;
   ```

### Testing the Logout Functionality

1. **Test Logout:**
   - Start your application and log in with a user.
   - Click the "Logout" link in the navbar.
   - Ensure that the user is logged out, the state is cleared, and the "Login" and "Register" links are shown again.

### Conditional Rendering of Navbar Elements

1. **Update Navbar to Conditionally Render Elements:**
   ```javascript
   // src/components/Navbar.jsx
   import React, { useContext } from 'react';
   import { Container, Nav, Navbar as BootstrapNavbar, Stack } from 'react-bootstrap';
   import { Link } from 'react-router-dom';
   import { AuthContext } from '../context/AuthContext';

   const Navbar = () => {
       const { user, logoutUser } = useContext(AuthContext);

       return (
           <BootstrapNavbar bg="dark" variant="dark" className="mb-4" style={{ height: '3.75rem' }}>
               <Container>
                   <BootstrapNavbar.Brand as={Link} to="/">Chat App</BootstrapNavbar.Brand>
                   <Nav className="ms-auto">
                       {user ? (
                           <Stack direction="horizontal" gap={3}>
                               <span className="text-warning">Logged in as {user.name}</span>
                               <Nav.Link as={Link} to="/login" onClick={logoutUser}>Logout</Nav.Link>
                           </Stack>
                       ) : (
                           <Stack direction="horizontal" gap={3}>
                               <Nav.Link as={Link} to="/login">Login</Nav.Link>
                               <Nav.Link as={Link} to="/register">Register</Nav.Link>
                           </Stack>
                       )}
                   </Nav>
               </Container>
           </BootstrapNavbar>
       );
   };

   export default Navbar;
   ```

### Summary

In this episode, we implemented the logout functionality by creating a `logoutUser` function in the `AuthContext` and updating the `Navbar` component to include a logout link. This allows users to log out, clearing the state and local storage, and conditionally rendering the appropriate navigation links based on the user's authentication status. In the next episode, we will handle user login and continue building our real-time chat application.