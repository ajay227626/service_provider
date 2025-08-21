import User from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { HttpStatusCodes } from '../utils/errorCodes';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default class AuthController {
  // Method to register a new user
  static registerUser = asyncHandler(async (req, res): Promise<void> => {
    const { email, fullName, password, department, phone } = req.body;
    console.log('14', req.body);

    if (!email || !password) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'email and password fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email }).lean() || await User.findOne({ phone }).lean();

    if (existingUser) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      role: 'admin',
      department,
      phone,
    });
    await newUser.save();

    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'User registered successfully' });
  });

  // Method to register a new user
  static loginUser = asyncHandler(async (req, res): Promise<void> => {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Email and password fields are required' });
      return;
    }

    // Check if the user exists
    const user = await User.findOne({ email }).lean();
    if (!user) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '48h',
    });

    const { password: _, ...userWithoutPassword } = user;

    res
      .status(HttpStatusCodes.OK)
      .json({ message: 'Login successful', token, user: userWithoutPassword });
  });

  static userVerify = asyncHandler(async (req, res): Promise<void> => {
    console.log('UserVerify request body:', req.body);
    const { input } = req.body;

    if (!input) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Email field is required' });
      return;
    }

    // Check if the user exists
    const user = await User.findOne({ email: input }) || await User.findOne({ phone: input });
    if (!user) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    // Send OTP email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

    // Update user's OTP
    user.otp = otp;
    user.ttl = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'Send OTP email' });
  });

  static resetPassword = asyncHandler(async (req, res): Promise<void> => {
    const { input, password } = req.body;
    console.log('ResetPassword request body:', req.body);

    if (!input || !password) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Email and password fields are required' });
      return;
    }
    // $2b$10$RgnGUgcXBqJW2I8pH1FNQ.392z9MnI9Xi3iIkB.LLF154Q/bfYr.2
    // Check if the user exists
    const user = await User.findOne({ email: input }) || await User.findOne({ phone: input });
    if (!user) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'Password change successfully' });
  });
}
