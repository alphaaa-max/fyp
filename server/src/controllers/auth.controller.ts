import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils';
import { CreateUserDto, LoginDto, AuthResponse, UserResponse } from '../types/user.types';
import { logger } from '../utils/logger';

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body as CreateUserDto;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name: name || undefined,
    });

    const user = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || null,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    logger.info(`New user registered: ${user.email}`);

    const response: AuthResponse = {
      token,
      user,
    };

    res.status(201).json({
      status: 'success',
      data: response,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginDto;

    // Find user
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, foundUser.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken({ id: foundUser.id, email: foundUser.email });

    logger.info(`User logged in: ${foundUser.email}`);

    const userResponse: UserResponse = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name || null,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };

    const response: AuthResponse = {
      token,
      user: userResponse,
    };

    res.json({
      status: 'success',
      data: response,
    });
  }
);

export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const foundUser = await User.findById(req.user.id).select('-password');

    if (!foundUser) {
      throw new AppError(404, 'User not found');
    }

    const user = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name || null,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };

    res.json({
      status: 'success',
      data: user,
    });
  }
);
