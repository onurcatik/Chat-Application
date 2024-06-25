# Real-Time Chat Application

## Protecting Routes and Persisting User State

In the previous episode, we successfully registered a user and saved their data to local storage. Now, we will protect certain routes based on the user's authentication status and persist the user state across page refreshes. 

### Persisting User State with useEffect

1. **Update AuthContext to Persist User State:**
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

       return (
           <AuthContext.Provider value={{ registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, user }}>
               {children}
           </AuthContext.Provider>
       );
   };
   ```

### Protecting Routes Based on User Authentication

1. **Update App Component to Protect Routes:**
   ```javascript
   // src/App.jsx
   import React, { useContext } from 'react';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import { AuthContext } from './context/AuthContext';
   import Chat from './pages/Chat';
   import Login from './pages/Login';
   import Register from './pages/Register';
   import Navbar from './components/Navbar';

   const App = () => {
       const { user } = useContext(AuthContext);

       return (
           <Router>
               <Navbar />
               <Routes>
                   <Route path="/" element={user ? <Chat /> : <Login />} />
                   <Route path="/login" element={user ? <Chat /> : <Login />} />
                   <Route path="/register" element={user ? <Chat /> : <Register />} />
               </Routes>
           </Router>
       );
   };

   export default App;
   ```

### Updating Navbar to Show Logged-In User

1. **Update Navbar Component to Display User Name:**
   ```javascript
   // src/components/Navbar.jsx
   import React, { useContext } from 'react';
   import { Container, Nav, Navbar as BootstrapNavbar, Stack } from 'react-bootstrap';
   import { Link } from 'react-router-dom';
   import { AuthContext } from '../context/AuthContext';

   const Navbar = () => {
       const { user } = useContext(AuthContext);

       return (
           <BootstrapNavbar bg="dark" variant="dark" className="mb-4" style={{ height: '3.75rem' }}>
               <Container>
                   <BootstrapNavbar.Brand as={Link} to="/">Chat App</BootstrapNavbar.Brand>
                   <Nav className="ms-auto">
                       {user ? (
                           <Stack direction="horizontal" gap={3}>
                               <span className="text-warning">Logged in as {user.name}</span>
                               {/* Add Logout Link */}
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

### Running and Testing the Application

1. **Ensure Backend is Running:**
   Make sure your backend server is running. If not, navigate to your backend directory and start it using `nodemon` or your preferred method.
   ```bash
   cd server
   nodemon index.js
   ```

2. **Test Protected Routes:**
   Open your browser and navigate to your React application. Ensure that:
   - If the user is not logged in, they are redirected to the login page.
   - If the user is logged in, they can access the chat page and their username is displayed in the navbar.

### Summary

In this episode, we implemented route protection based on user authentication status and persisted the user state across page refreshes. This ensures that users remain logged in even after refreshing the page and cannot access certain routes unless authenticated. In the next episode, we will implement the logout functionality to allow users to log out and handle the state accordingly.