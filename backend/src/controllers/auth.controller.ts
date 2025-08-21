import User from '../models/user.model';
import Otp from '../models/verify.models';
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
    const salt = await bcrypt.genSalt(2);
    const hashedPassword = await bcrypt.hash(password, salt);

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
    const { input } = req.body;

    if (!input) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Email field is required' });
      return;
    }

    // Check if the user exists
    const user =
      (await User.findOne({ email: input })) ||
      (await User.findOne({ phone: input }));

    if (!user) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    // Delete old OTPs for this user
    await Otp.deleteMany({ userId: user._id });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save new OTP
    const otpDoc = new Otp({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    await otpDoc.save();

    res.status(HttpStatusCodes.CREATED).json({
      message: 'OTP generated and sent',
    });
  });

  static otpVerify = asyncHandler(async (req, res): Promise<void> => {
    const { input, otp } = req.body;

    if (!input || !otp) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Email/Phone and OTP are required' });
      return;
    }

    // Check if the user exists
    const user =
      (await User.findOne({ email: input })) ||
      (await User.findOne({ phone: input }));

    if (!user) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    // Check if the OTP is valid
    const otpDoc = await Otp.findOne({ userId: user._id, otp });
    if (!otpDoc) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Invalid OTP' });
      return;
    }

    // Check if the OTP has expired
    if (otpDoc.expiresAt < new Date()) {
      // Delete expired OTP
      await Otp.deleteOne({ _id: otpDoc._id });
      res.status(HttpStatusCodes.GONE).json({ message: 'OTP has expired' });
      return;
    }

    // ✅ OTP is valid and not expired → delete after verification
    await Otp.deleteOne({ _id: otpDoc._id });

    // Generate Reset Token (JWT - expires in 10 min)
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );

    res.status(HttpStatusCodes.OK).json({
      message: 'OTP verified successfully',
      resetToken
    });
  });

  static resetPassword = asyncHandler(async (req, res): Promise<void> => {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Reset token and password fields are required' });
      return;
    }

    // Verify Reset Token
    const decoded: any = jwt.verify(resetToken, process.env.JWT_SECRET!);
    if (!decoded || decoded.purpose !== "reset-password") {
      res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired reset token' });
      return;
    }


    // Check if the user exists
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
      return;
    }

    const salt = await bcrypt.genSalt(2);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'Password change successfully' });
  });
}
