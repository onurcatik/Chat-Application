# Real-Time Chat Application 

## Creating RESTful APIs Using Node.js, Express, and MongoDB

In this tutorial, we will continue developing our real-time chat application by creating the necessary APIs for user authentication and data storage. We will use Node.js, Express, and MongoDB for the backend. 

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm
- MongoDB account

### Setting Up the Development Environment

1. **Install Node.js:**
   Visit [Node.js](https://nodejs.org/) and download the recommended stable version. Verify the installation by running:
   ```bash
   node -v
   ```

2. **Install Visual Studio Code:**
   Download and install [Visual Studio Code](https://code.visualstudio.com/).

3. **Create Project Structure:**
   Create a folder named `chat-app` and within it, create subfolders for the frontend (`client`), backend (`server`), and Socket.IO (`socket`).

### Initializing the Server

1. **Initialize npm and Install Dependencies:**
   Navigate to the `server` folder and initialize npm:
   ```bash
   cd server
   npm init -y
   ```
   Install the necessary dependencies:
   ```bash
   npm install express mongoose cors dotenv bcryptjs jsonwebtoken validator
   ```

2. **Create Project Files:**
   In the `server` folder, create the following files:
   - `index.js`: The main entry point.
   - `.env`: Environment variables.
   - `models/userModel.js`: For defining user schema.
   - `routes/userRoute.js`: For handling user routes.
   - `controllers/userController.js`: For business logic related to users.

### Setting Up the Express Server

```javascript
// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection established'))
.catch((error) => console.log('DB connection failed:', error.message));

// Import user routes
const userRoute = require('./routes/userRoute');
app.use('/api/users', userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Creating User Model

```javascript
// server/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, minlength: 5, maxlength: 255 },
  password: { type: String, required: true, minlength: 6, maxlength: 1024 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
```

### Creating User Controllers

```javascript
// server/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: 'Password must be strong' });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User with the given email already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });

  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });

  res.status(200).json({ _id: user._id, name: user.name, email: user.email, token });
};

const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
};

module.exports = { registerUser, loginUser, getUsers, getUser };
```

### Creating User Routes

```javascript
// server/routes/userRoute.js
const express = require('express');
const { registerUser, loginUser, getUsers, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:userId', getUser);

module.exports = router;
```

### Testing the APIs

Use [Postman](https://www.postman.com/) to test the APIs:

1. **Register a User:**
   - Endpoint: `POST http://localhost:5000/api/users/register`
   - Body:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "Password@123"
     }
     ```

2. **Login a User:**
   - Endpoint: `POST http://localhost:5000/api/users/login`
   - Body:
     ```json
     {
       "email": "john@example.com",
       "password": "Password@123"
     }
     ```

3. **Get All Users:**
   - Endpoint: `GET http://localhost:5000/api/users/`

4. **Get a User by ID:**
   - Endpoint: `GET http://localhost:5000/api/users/{userId}`

### Next Steps

In the upcoming tutorial, we will focus on integrating the backend APIs with our React frontend using the Context API for state management. We will also design the user interface for registration, login, and real-time chat features.

