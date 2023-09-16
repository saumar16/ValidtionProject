const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/registrationDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a Mongoose schema for the user
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  country: String,
  state: String,
  city: String,
  gender: String,
  dateOfBirth: Date,
});

const User = mongoose.model('User', userSchema);

// Custom validation functions
const isAlpha = (value) => /^[A-Za-z]+$/.test(value);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isDateOlderThan14 = (value) => {
  const today = new Date();
  const birthDate = new Date(value);
  const age = today.getFullYear() - birthDate.getFullYear();
  return age > 14;
};

// POST route for registration
app.post('/register', (req, res) => {
  const { firstName, lastName, email, country, state, city, gender, dateOfBirth } = req.body;

  if (!isAlpha(firstName) || !isAlpha(lastName)) {
    return res.status(400).send('First name and last name must contain only alphabets.');
  }

  if (!isEmail(email)) {
    return res.status(400).send('Invalid email format.');
  }

  // Add more custom validations as needed

  // Check date of birth
  if (!isDateOlderThan14(dateOfBirth)) {
    return res.status(400).send('Date of birth must be older than 14 years.');
  }

  const user = new User(req.body);
  user.save((err, savedUser) => {
    if (err) {
      return res.status(500).send('Error saving user to database');
    }
    res.status(201).send('User registered successfully');
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
