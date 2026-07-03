const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Reservation = require('./models/Reservation');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Ensure MongoDB is running or configure MONGODB_URI in server/.env');
  });

const menuItems = [
  {
    name: 'Smoked Tomato Pasta',
    price: '$18',
    description: 'Creamy tomato sauce with basil and parmesan.',
  },
  {
    name: 'Charred Steak',
    price: '$24',
    description: 'Served with garlic potatoes and herb butter.',
  },
  {
    name: 'Garden Glow Salad',
    price: '$12',
    description: 'Fresh greens, citrus, and toasted seeds.',
  },
];

// Menu Endpoint
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Authentication Endpoints

// @route   POST /api/auth/register
// @desc    Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    // Check if user already exists
    let userByEmail = await User.findOne({ email: email.toLowerCase() });
    if (userByEmail) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // Create user and hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Generate JWT Token
    const payload = {
      user: {
        id: savedUser._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'restaurant_secret_key_2026',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    // Generate JWT Token
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'restaurant_secret_key_2026',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user details (Protected)
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Fetch user details error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reservations Endpoints

// @route   POST /api/reservations
// @desc    Create a reservation (Public, with optional authenticated user attachment)
app.post('/api/reservations', async (req, res) => {
  const { name, date, guests, request } = req.body;

  if (!name || !date || !guests) {
    return res.status(400).json({ message: 'Please provide your name, date, and guest count.' });
  }

  // Check if token is provided to link user
  let userId = null;
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'restaurant_secret_key_2026');
      userId = decoded.user.id;
    } catch (err) {
      // Ignore token failure for public booking route and treat as guest
    }
  }

  try {
    const newReservation = new Reservation({
      user: userId,
      name,
      date: new Date(date),
      guests: Number(guests),
      request: request || ''
    });

    const savedReservation = await newReservation.save();
    res.status(201).json({
      message: 'Reservation received',
      id: savedReservation._id,
      name: savedReservation.name,
      date: savedReservation.date,
      guests: savedReservation.guests,
      request: savedReservation.request || 'No special requests',
    });
  } catch (err) {
    console.error('Reservation creation error:', err);
    res.status(500).json({ message: 'Failed to create reservation. Please check input parameters.' });
  }
});

// @route   GET /api/reservations/my
// @desc    Get reservations for current user (Protected)
app.get('/api/reservations/my', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort({ date: 1 });
    res.json(reservations);
  } catch (err) {
    console.error('Fetch reservations error:', err);
    res.status(500).json({ message: 'Server error fetching reservations.' });
  }
});

app.get('/', (req, res) => {
  res.send('Restaurant API with Authentication is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
