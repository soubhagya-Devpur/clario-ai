const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Helper to initialize local DB
const initLocalDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
};

// Helper to read users from local DB
const getLocalUsers = () => {
  initLocalDB();
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
};

// Helper to write users to local DB
const saveLocalUsers = (users) => {
  initLocalDB();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Helper to check if Mongoose is connected
const isMongooseConnected = () => mongoose.connection.readyState === 1;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please add all fields' });
    }

    // Check if user exists
    let userExists;
    if (isMongooseConnected()) {
      userExists = await User.findOne({ email });
    } else {
      const users = getLocalUsers();
      userExists = users.find(u => u.email === email);
    }

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    let user;
    if (isMongooseConnected()) {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    } else {
      const users = getLocalUsers();
      user = {
        _id: Date.now().toString(),
        name,
        email,
        password: hashedPassword
      };
      // Provide an id alias since some frontend code checks user.id
      user.id = user._id;
      users.push(user);
      saveLocalUsers(users);
    }

    if (user) {
      res.status(201).json({
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id || user.id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    let user;
    if (isMongooseConnected()) {
      user = await User.findOne({ email });
    } else {
      const users = getLocalUsers();
      user = users.find(u => u.email === email);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id || user.id),
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
};

