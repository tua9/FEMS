import bcrypt from 'bcrypt';
import User from '../models/User.js';


export const signUp = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if(!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
      username,
      email,
      hashedPassword,
      displayName: `${firstName} ${lastName}`,
    });

    res.status(204).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during sign up: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 

export const signIn = async (req, res) => {
  // Implementation for signIn
}

export const signOut = async (req, res) => {
  // Implementation for signOut
}