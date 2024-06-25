#  Real-Time Chat Application 

## Implementing User Interface with React Bootstrap

In this tutorial, we will focus on creating the user interface for our chat application using React Bootstrap along with some custom CSS. We will design the login and registration forms, and implement basic navigation between different pages.

### Setting Up React Bootstrap

1. **Install React Bootstrap and Bootstrap:**
   Open a new terminal in the `client` directory and run the following command:
   ```bash
   npm install react-bootstrap bootstrap
   ```

2. **Import Bootstrap CSS:**
   Add the Bootstrap CSS import at the top of your `index.css` file:
   ```css
   /* src/index.css */
   @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');
   
   /* Custom CSS */
   body {
       background: rgb(40, 40, 40);
       font-family: 'Nunito', sans-serif;
   }
   ```

### Basic Setup for the Application

1. **Update `App.jsx` to Include React Bootstrap:**
   ```javascript
   // src/App.jsx
   import React from 'react';
   import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
   import { Container } from 'react-bootstrap';
   import Chat from './pages/Chat';
   import Login from './pages/Login';
   import Register from './pages/Register';
   import Navbar from './components/Navbar';
   import './index.css';

   function App() {
       return (
           <Router>
               <Navbar />
               <Container>
                   <Routes>
                       <Route path="/" element={<Chat />} />
                       <Route path="/login" element={<Login />} />
                       <Route path="/register" element={<Register />} />
                       <Route path="*" element={<Navigate to="/" />} />
                   </Routes>
               </Container>
           </Router>
       );
   }

   export default App;
   ```

### Creating the Navbar Component

1. **Create `Navbar.jsx`:**
   ```javascript
   // src/components/Navbar.jsx
   import React from 'react';
   import { Container, Nav, Navbar, Stack } from 'react-bootstrap';
   import { Link } from 'react-router-dom';

   const AppNavbar = () => {
       return (
           <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
               <Container>
                   <Navbar.Brand as={Link} to="/">
                       Chat App
                   </Navbar.Brand>
                   <Nav className="ms-auto">
                       <Stack direction="horizontal" gap={3}>
                           <Nav.Link as={Link} to="/login" className="text-light">
                               Login
                           </Nav.Link>
                           <Nav.Link as={Link} to="/register" className="text-light">
                               Register
                           </Nav.Link>
                       </Stack>
                   </Nav>
               </Container>
           </Navbar>
       );
   };

   export default AppNavbar;
   ```

### Creating the Login and Register Forms

1. **Create `Login.jsx`:**
   ```javascript
   // src/pages/Login.jsx
   import React from 'react';
   import { Form, Button, Row, Col, Stack, Alert } from 'react-bootstrap';

   const Login = () => {
       return (
           <Row className="justify-content-md-center" style={{ height: '100vh', paddingTop: '10%' }}>
               <Col xs={12} md={6}>
                   <Stack gap={3}>
                       <h2 className="text-light">Login</h2>
                       <Form>
                           <Form.Group controlId="formEmail">
                               <Form.Control type="email" placeholder="Email" />
                           </Form.Group>
                           <Form.Group controlId="formPassword">
                               <Form.Control type="password" placeholder="Password" />
                           </Form.Group>
                           <Button variant="primary" type="submit">
                               Login
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

   export default Login;
   ```

2. **Create `Register.jsx`:**
   ```javascript
   // src/pages/Register.jsx
   import React from 'react';
   import { Form, Button, Row, Col, Stack, Alert } from 'react-bootstrap';

   const Register = () => {
       return (
           <Row className="justify-content-md-center" style={{ height: '100vh', paddingTop: '10%' }}>
               <Col xs={12} md={6}>
                   <Stack gap={3}>
                       <h2 className="text-light">Register</h2>
                       <Form>
                           <Form.Group controlId="formName">
                               <Form.Control type="text" placeholder="Name" />
                           </Form.Group>
                           <Form.Group controlId="formEmail">
                               <Form.Control type="email" placeholder="Email" />
                           </Form.Group>
                           <Form.Group controlId="formPassword">
                               <Form.Control type="password" placeholder="Password" />
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

In the next episode, we will cover using the Context API to manage the state of our application. This will include handling form state, making HTTP requests to register and log in users, and managing user authentication state throughout the application.

Stay tuned for more detailed tutorials on building a robust real-time chat application.