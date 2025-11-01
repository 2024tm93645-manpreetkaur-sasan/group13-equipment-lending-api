import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for existing user
    if (await User.findOne({ email })) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || process.env.DEFAULT_USER_ROLE,
    });

    // ✅ No token generated or returned
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid credentials' });

    const token = generateToken({ id: user._id, role: user.role });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        token
      },
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};
