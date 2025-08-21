import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatusCodes } from '../utils/errorCodes';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

export default class UserController {
  // Method to get user data with jwt token
  static getUserDataWithToken = asyncHandler(
    async (req, res): Promise<void> => {
      res.status(HttpStatusCodes.OK).send(req.user);
    },
  );

  static newMember = asyncHandler(async (req, res): Promise<void> => {
    if (!req.user || req.user.role !== 'admin') {
      res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Access denied' });
      return;
    }

    const { email, name, password, department, resetPass } = req.body;

    if (!email || !name || !password || !department || resetPass == undefined) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email }).lean();

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
      name,
      password: hashedPassword,
      role: 'user',
      department,
      resetPass,
    });
    let savedUser = await newUser.save();

    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'User registered successfully', user: savedUser });
  });

  // Method to delete user
  static deleteUser = asyncHandler(async (req, res): Promise<void> => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res
        .status(HttpStatusCodes.OK)
        .send({ message: 'User Deleted Successfully' });
    } catch (err) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  });

  // GetMember...

  static GetMember = asyncHandler(
    async (_: Request, res: Response): Promise<void> => {
      try {
        const members = await User.find({ role: 'user' }).select(
          'name email department',
        );
        res.status(HttpStatusCodes.OK).json(members);
      } catch (error) {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error fetching team members', error });
      }
    },
  );
}
